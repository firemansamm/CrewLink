import dgram, { RemoteInfo, Socket } from 'dgram';
import { parsePacket, composePacket, PayloadID, Code2Int, PlayerClient } from 'amongus-protocol/js';
import GameStateProcessor from './GameStateProcessor';

import type { Packet, Payload } from 'amongus-protocol/ts/lib/interfaces/Packets';

const BROADCAST_INTERVAL_MSEC = 500;
const LOCAL_GAME_CODE = 32;
//const DEBUG = false;
const LC = Buffer.alloc(4);
LC.writeInt32LE(LOCAL_GAME_CODE, 0);

// masquerade as a local game, and when someone joins, we first start a join, then we forward all the
// events to the other end. if we need any extra info to match crewlink, we can interface it here. this is a server.

const stringToHex = (s: string): string => {
    return Buffer.from(s).toString('hex');
};

class GameProxy {
    destinationServer = '';
    destinationPort = 0;
    source: RemoteInfo;
    cachedHello: Packet | null = null;
    cachedJoin: Packet | null = null;
    playerMap = {};
    playerReverseMap = {};
    clientid = 0;
    gameState = new GameStateProcessor();
    players = {};
    gameCode = 0;
    socket: Socket;
    _bs: Buffer = Buffer.alloc(4);


    constructor(source: RemoteInfo, code: string, server: [string, number]) {
        this.destinationServer = server[0];
        this.destinationPort = server[1];
        this.source = source;
        this.gameCode = Code2Int(code);
    
        this._bs.writeInt32LE(this.gameCode, 0);

        this.socket = dgram.createSocket('udp4');
        this.socket.on('message', this.handleServerPacket.bind(this));
        
        //if (DEBUG) console.log(this.destinationServer, this.destinationPort);
    }

    async handleServerPacket(message: Buffer, info: RemoteInfo) {
        if (info.address != this.destinationServer) return; // we don't care about other servers sending us disconnects eg.

        // do brain surgery the packet to replace the code?
        let idx = null;
        if ((idx = message.indexOf(this._bs)) !== -1) message.writeInt32LE(LOCAL_GAME_CODE, idx);

        const recp = parsePacket(message, 'client');
        
        if (!('payloads' in recp)) {
            this.socket.send(message, this.source.port, this.source.address);
            this.gameState.processPacket(recp);
            return;
        } else if (recp.payloads.filter(x => x.payloadid == PayloadID.JoinedGame).length != 0) {
            this.socket.send(message, this.source.port, this.source.address);
            const joined = recp.payloads.filter((x: Payload) => x.payloadid == PayloadID.JoinedGame)[0];
            // @ts-ignore too lazy to deal with this
            this.clientid = joined.clientid;
            this.gameState.processPacket(recp);
        } else if (recp.payloads.filter(x => x.payloadid == PayloadID.Redirect).length != 0
                && this.cachedHello &&  this.cachedJoin) {
            const join = recp.payloads.filter((x: Payload) => x.payloadid == PayloadID.Redirect)[0];
            // @ts-ignore too lazy to deal with this
            this.destinationPort = join.port;
            // @ts-ignore too lazy to deal with this
            this.destinationServer = join.ip;
            this.socket.send(composePacket(this.cachedHello, 'server'), this.destinationPort, this.destinationServer);
            this.socket.send(composePacket(this.cachedJoin, 'server'), this.destinationPort, this.destinationServer);
        } else if (recp.payloads.filter(x => x.payloadid == PayloadID.MasterServerList).length != 0) {
            // pass
        } else {
            this.socket.send(message, this.source.port, this.source.address);
            this.gameState.processPacket(recp);
        }

    }

    update() {
        // this is sadly slow as balls i think
        if (this?.gameState?.game?.clients == null) return null;
        const v = {
            players: Array.from(this.gameState.game.clients.values(), (z: PlayerClient) => {
                if (!z || !z.Player) return null;
                const {x, y} = z.Player.CustomNetworkTransform.position;
                return {
                    ptr: 0,
                    id: z.Player.PlayerControl.playerId,
                    name: z.name ?? '???', 
                    colorId: z.PlayerData?.color ?? 0,
                    hatId: z.PlayerData?.hat ?? 0,
                    petId: z.PlayerData?.pet ?? 0,
                    skinId: z.PlayerData?.skin ?? 0,
                    disconnected: z.PlayerData?.disconnected ?? false,
                    isImpostor: z.PlayerData?.impostor ?? false,
                    isDead: z.PlayerData?.dead ?? false,
                    taskPtr: 0,
                    objectPtr: 0,
                    inVent: this.gameState.vented.has(z.id) && this.gameState.vented.get(z.id),
                    isLocal: z.id == this.clientid,
                    x, y
                };
            }).filter(x => x != null),
            vents: this.gameState.vented,
            localclientid: this.clientid,
            meeting: this.gameState.game?.MeetingHub?.MeetingHud != null
        };
        if (v.players.find(x => x.isLocal) == null) return null; //UGLY
        else return v;
    }

    receivePacket(packet: Buffer) {
        // forward packet
        const pp = parsePacket(packet, 'server');
        if (pp.op == 8) this.cachedHello = pp; // cache the hello if we want to redirect 

        if ('payloads' in pp && pp.payloads.filter(x => x.payloadid == PayloadID.JoinGame).length != 0) {
            const join = pp.payloads.filter((x: Payload) => x.payloadid == PayloadID.JoinGame)[0];
            // @ts-ignore too lazy to deal with this
            join.code = this.gameCode;
            this.cachedJoin = pp;
            this.socket.send(composePacket(pp, 'server'), this.destinationPort, this.destinationServer);
            return;
        }

        let idx = null;
        if ((idx = packet.indexOf(LC)) !== -1) packet.writeInt32LE(this.gameCode, idx);

        //if (DEBUG) console.log('OUTBOUND >>> \n', inspect(pp, false, null, false));
        this.gameState.processPacket(pp);
        this.socket.send(packet, this.destinationPort, this.destinationServer);
    }
}

export default class ProxyServer {
    activeProxy: GameProxy | null = null;
    name = '';
    code = '';
    server: [string, number] = ['', 0];
    boundIP = '';

    constructor(name: string, code: string, server: [string, number], boundIP: string) {
        this.name = name;
        this.code = code;
        this.server = server;
        this.boundIP = boundIP;
    }

    update() {
        return this.activeProxy?.update();
    }

    async start(): Promise<void> {
        const sock = dgram.createSocket('udp4');
        await new Promise((resolve) => {sock.bind(22023, '0.0.0.0', () => {resolve(null);});});
        sock.on('message', async (m, i) => {
            const pp = parsePacket(m);
            if (pp.op == 8 && !this.activeProxy) {
                const proxy = new GameProxy(i, this.code, this.server);
                this.activeProxy = proxy;
            }

            if (!this.activeProxy) return;
            else this.activeProxy.receivePacket(m);

            if (pp.op == 9) {
                this.activeProxy = null;
            }
        });

        const bSock = dgram.createSocket('udp4');

        bSock.bind(0, this.boundIP, () => {
            bSock.setBroadcast(true);
            const msg = Buffer.from(
                `0402${stringToHex(this.name)}7e4f70656e7e${stringToHex('?')}7e`,
                'hex'
            );
            
            setInterval(() => {
                if (!this.activeProxy) bSock.send(msg, 47777, '255.255.255.255'); 
            }, BROADCAST_INTERVAL_MSEC);
        });
    }
}