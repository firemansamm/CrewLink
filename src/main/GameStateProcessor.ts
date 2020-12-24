import { Game, PacketID, PayloadID, GameObject, RPCID, MessageID, SpawnID, AlterGameTag, Packets, PlayerClient } from 'amongus-protocol/js';
const {ShipStatus, MeetingHub, LobbyBehaviour, GameData, Player, HeadQuarters, PlanetMap, AprilShipStatus} = GameObject;
const {PlayerVoteAreaFlags} = Packets;

import type {Packet} from 'amongus-protocol/ts/lib/interfaces/Packets';

// we ripped this from the other repo, so that we can keep track of the game state meaningfully 
// as part of our MITM.

// there's a whole bunch of ts-ignores sprinked around because we're sending our processor in stead of a client. it's read only anyway.

export default class GameStateProcessor {
    id = -10;
    game: Game | null = null;
    clientid = -1;
    vented: Map<number, boolean> = new Map();

    async processPacket(packet: Packet) : Promise<void> {
        switch (packet.op) {
            case PacketID.Unreliable:
            case PacketID.Reliable:
                for (let i = 0; i < packet.payloads.length; i++) {
                    const payload = packet.payloads[i];

                    switch (payload.payloadid) {
                        case PayloadID.JoinGame:
                            if (payload.bound === 'client') {
                                switch (payload.error) {  // Couldn't get typings to work with if statements so I have to deal with switch/case.
                                    case false:
                                        if (!this.game) continue;
                                        this.game.playerJoin(payload.clientid);
                                        this.game.hostid = payload.hostid;
                                        break;
                                }
                            }
                            break;
                        case PayloadID.StartGame:
                            this.game?._start();
                            break;
                        case PayloadID.EndGame:
                            this.game?._finish(payload.reason, payload.show_ad);
                            this.game = null;
                            break;
                        case PayloadID.RemovePlayer:
                            const client = this.game?.clients.get(payload.clientid);
                            if (client) {
                                client.removed = true;

                                this.game?.clients.delete(payload.clientid);
                                this.game?.emit('playerLeave', client);
                            }
                            break;
                        case PayloadID.JoinedGame:
                            if (!this.game) {
                                //@ts-ignore
                                this.game = new Game(this, null, null, payload.code, payload.hostid, [payload.clientid, ...payload.clients]);
                                this.clientid = payload.clientid;
                            }
                            break;
                        /*case PayloadID.KickPlayer:
                            if (payload.bound === 'client') {
                                const client = this.game?.clients.get(payload.clientid);

                                if (client) {
                                    client.emit('kicked', payload.banned);
                                }
                            }
                            break;*/
                        case PayloadID.GameData:
                        case PayloadID.GameDataTo:
                            for (let i = 0; i < payload.parts.length; i++) {
                                const part = payload.parts[i];

                                switch (part.type) {
                                    case MessageID.Data:
                                        const component = this.game?.netcomponents.get(part.netid);

                                        if (component) {
                                            component.OnDeserialize(part.datalen, part.data);
                                        }
                                        break;
                                    case MessageID.RPC:
                                        switch (part.rpcid) {
                                            /*case RPCID.CompleteTask:
                                                break;
                                            case RPCID.SyncSettings:
                                                this.game?._syncSettings(part.options);
                                                break*/
                                            case RPCID.SetInfected:
                                                this.game?._setImposters(part.infected);
                                                break;
                                            case RPCID.MurderPlayer: {
                                                const client = this.game?.getClientByComponent(part.targetnetid);
                                                const murderer = this.game?.getClientByComponent(part.handlerid);
                                                
                                                if (client && murderer) {
                                                    client.dead = true;

                                                    this.game?.emit('murder', murderer, client);

                                                    client.emit('murdered', murderer);
                                                    murderer.emit('murder', client);
                                                }
                                                break;
                                            }
                                            /*case RPCID.SendChat: {
                                                const client = this.game?.getClientByComponent(part.handlerid);

                                                if (client) {
                                                    this.game?.emit('chat', client, part.text);
                                                    client.emit('chat', part.text);
                                                }
                                                break;
                                            }*/
                                            case RPCID.StartMeeting:
                                                this.vented.clear();
                                                if (part.targetid === 0xFF) {
                                                    this.game?.emit('meeting', true, null);
                                                } else {
                                                    const target = this.game?.getClientByPlayerID(part.targetid);
                                                    this.game?.emit('meeting', false, target);
                                                }
                                                break;
                                            /*case RPCID.SetStartCounter:
                                                if (!this.game) return;
                                                if (this.game.startCounterSeq === null || part.sequence > this.game.startCounterSeq) {
                                                    this.game.startCount = part.time;
                                                    this.game.emit('startCount', this.game.startCount);
                                                }
                                                break;
                                            case RPCID.VotingComplete:
                                                const states = new Map;

                                                for (let playerId = 0; playerId < part.states.length; playerId++) {
                                                    const flags = part.states[playerId];

                                                    const state = {
                                                        flags,
                                                        playerId,
                                                        votedFor: flags & PlayerVoteAreaFlags.VotedFor,
                                                        reported: (flags & PlayerVoteAreaFlags.DidReport) !== 0,
                                                        voted: (flags & PlayerVoteAreaFlags.DidVote) !== 0,
                                                        dead: (flags & PlayerVoteAreaFlags.IsDead) !== 0
                                                    };

                                                    states.set(playerId, state);
                                                }

                                                if (part.tie) {
                                                    this.game?.emit('votingComplete', false, true, null);
                                                } else if (part.ejected === 0xFF) {
                                                    this.game?.emit('votingComplete', true, false, null);
                                                } else {
                                                    this.game?.emit('votingComplete', false, false, this.game.getClientByPlayerID(part.ejected));
                                                }
                                                break;
                                            case RPCID.SetTasks:
                                                const client = this.game?.getClientByPlayerID(part.playerid);

                                                if (client) {
                                                    client._setTasks(part.tasks);
                                                }
                                                break;*/
                                            case RPCID.UpdateGameData:
                                                if (!this.game) return;
                                                await this.game.awaitChild(SpawnID.GameData);

                                                this.game.GameData.GameData.UpdatePlayers(part.players);
                                                break;
                                            case RPCID.EnterVent:
                                                if (!this.game) return;
                                                this.vented.set(part.handlerid, true);
                                                break;

                                            case RPCID.ExitVent:
                                                if (!this.game) return;
                                                this.vented.set(part.handlerid, false);
                                                break;
                                        }
                                        break;
                                    case MessageID.Spawn:
                                        if (!this.game) return;
                                        switch (part.spawnid) {
                                            case SpawnID.ShipStatus:
                                                //@ts-ignore
                                                new ShipStatus(this, this.game, part.components);
                                                break;
                                            case SpawnID.MeetingHub:
                                                //@ts-ignore
                                                new MeetingHub(this, this.game, part.components);
                                                break;
                                            case SpawnID.LobbyBehaviour:
                                                //@ts-ignore
                                                new LobbyBehaviour(this, this.game, part.components)
                                                break;
                                            case SpawnID.GameData:
                                                //@ts-ignore
                                                new GameData(this, this.game, part.components);
                                                break;
                                            case SpawnID.Player:
                                                const playerclient = this.game.clients.get(part.ownerid);

                                                //@ts-ignore
                                                new Player(this, playerclient, part.components);
                                                break;
                                            case SpawnID.HeadQuarters:
                                                //@ts-ignore
                                                new HeadQuarters(this, this.game, part.components);
                                                break;
                                            case SpawnID.PlanetMap:
                                                //@ts-ignore
                                                new PlanetMap(this, this.game, part.components);
                                                break;
                                            case SpawnID.AprilShipStatus:
                                                //@ts-ignore
                                                new AprilShipStatus(this, this.game, part.components);
                                                break;
                                        }
                                        break;
                                    case MessageID.Despawn:
                                        if (!this.game) return;
                                        this.game.netcomponents.delete(part.netid);
                                        break;
                                    case MessageID.Ready:
                                        if (!this.game) return;
                                        const client = this.game.clients.get(part.clientid);

                                        if (client) {
                                            client.is_ready = true;
                                        }
                                        break;
                                }
                            }
                            break;
                        case PayloadID.AlterGame:
                            switch (payload.tag) {
                                case AlterGameTag.ChangePrivacy:
                                    if (!this.game) return;
                                    this.game._setVisibility(payload.is_public ? 'public' : 'private');
                                    break;
                            }
                            break;
                    }
                    break;
                }
                break;
        }
    }
}