var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AlterGameTag, MessageID, PacketID, PayloadID, RPCID, SpawnID } from "../constants/Enums.js";
import { GameData } from "./objects/GameData.js";
import { GameObject } from "./objects/GameObject.js";
import { MeetingHub } from "./objects/MeetingHub.js";
import { PlayerClient } from "./PlayerClient.js";
export class Game extends GameObject {
    constructor(client, ip, port, code, hostid, clients) {
        super(client, client);
        this.client = client;
        this.id = -2;
        this.ip = ip;
        this.port = port;
        this.code = code;
        this.hostid = hostid;
        this.clients = new Map;
        this.netcomponents = new Map;
        this.instantiated = Date.now();
        this.startCount = -1;
        this.startCounterSeq = null;
        this.started = false;
        this.imposters = [];
        this.options = null;
        this.visibility = "private";
        clients.forEach(clientid => {
            this.clients.set(clientid, new PlayerClient(client, clientid));
        });
    }
    get age() {
        return Math.floor((Date.now() - this.instantiated) / 1000);
    }
    get impostors() {
        return this.imposters;
    }
    addChild(object) {
        super.addChild(object);
        this.registerComponents(object);
        this.emit("spawn", object);
    }
    awaitSpawns() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.awaitChild(SpawnID.GameData);
            return yield Promise.all([...this.clients.values()].map(client => client.awaitSpawn()));
        });
    }
    get GameData() {
        return this.children.find(child => child instanceof GameData);
    }
    get MeetingHub() {
        return this.children.find(child => child instanceof MeetingHub);
    }
    _syncSettings(options) {
        this.options = options;
        this.emit("sync", this.options);
    }
    syncSettings(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameData,
                            code: this.code,
                            parts: [
                                {
                                    type: MessageID.RPC,
                                    handlerid: this.host.Player.PlayerControl.netid,
                                    rpcid: RPCID.SyncSettings,
                                    options: options
                                }
                            ]
                        }
                    ]
                });
                this._syncSettings(options);
            }
        });
    }
    _setImposters(imposters) {
        this.imposters = imposters.map(imposter => this.getClientByPlayerID(imposter));
        this.emit("setImposters", this.imposters);
        this.emit("setImpostors", this.imposters);
    }
    _setImpostors(impostors) {
        return this._setImposters(impostors);
    }
    setImposters(imposters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameData,
                            code: this.code,
                            parts: [
                                {
                                    type: MessageID.RPC,
                                    handlerid: this.host.Player.PlayerControl.netid,
                                    rpcid: RPCID.SetInfected,
                                    count: imposters.length,
                                    infected: imposters
                                }
                            ]
                        }
                    ]
                });
                this._setImposters(imposters);
            }
        });
    }
    setImpostors(impostors) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setImposters(impostors);
        });
    }
    _setVisibility(visibility) {
        this.visibility = visibility;
        this.emit("visibility", visibility);
    }
    setVisibility(visibility) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.AlterGame,
                            code: this.code,
                            tag: AlterGameTag.ChangePrivacy,
                            is_public: visibility === "public"
                        }
                    ]
                });
                this._setVisibility(visibility);
            }
        });
    }
    _setStartCounter(sequence, counter = -1) {
        if (sequence > this.startCounterSeq) {
            this.startCounterSeq = sequence;
            this.startCount = counter;
            this.emit("startCount", counter);
        }
    }
    setStartCounter(counter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sequence = this.startCounterSeq + 1;
            if (this.client.clientid === this.hostid) {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameData,
                            code: this.code,
                            parts: [
                                {
                                    type: MessageID.RPC,
                                    handlerid: this.host.Player.PlayerControl.netid,
                                    rpcid: RPCID.SetStartCounter,
                                    sequence: sequence,
                                    time: counter
                                }
                            ]
                        }
                    ]
                });
                this._setStartCounter(sequence, counter);
            }
        });
    }
    _playerJoin(clientid) {
        const client = new PlayerClient(this.client, clientid);
        this.clients.set(client.clientid, client);
        this.emit("playerJoin", client);
    }
    playerJoin(clientid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                this.setStartCounter(-1);
            }
            this._playerJoin(clientid);
        });
    }
    _sceneChange(clientid, location) {
        const client = this.clients.get(clientid);
        if (client) {
            this.emit("sceneChange", client, location);
            client.emit("sceneChange", location);
        }
    }
    sceneChange(clientid, location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                const gamedata = yield this.awaitChild(SpawnID.GameData);
                const lobbybehaviour = yield this.awaitChild(SpawnID.LobbyBehaviour);
                // Perhaps the worst code I have ever written.
                // V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V-V
                /*const player_objects = (await Promise.allSettled([...this.clients.values()].map(client => {
                    if (client.clientid === clientid) return Promise.resolve();
    
                    return client.awaitChild(SpawnID.Player);
                }))).map(settled => (settled.status === "fulfilled" ? settled.value : null) as GameObject) // Get all player objects connected, and if they aren't spawned yet, wait for them.
    
                await this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameDataTo,
                            code: this.code,
                            recipient: clientid,
                            parts: [
                                gamedata,
                                lobbybehaviour,
                                ...player_objects
                            ].map(object => {
                                return {
                                    type: MessageID.Spawn,
                                    spawnid: object.spawnid,
                                    ownerid: object.parentid,
                                    flags: 0,
                                    num_components: object.components.length,
                                    components: (object.components as Component[]).map(component => {
                                        const serialised = component.Serialize();
    
                                        return {
                                            netid: component.netid,
                                            type: 0,
                                            datalen: serialised.byteLength,
                                            data: serialised
                                        }
                                    })
                                }
                            })
                        }
                    ]
                });*/
                this._sceneChange(clientid, location);
            }
        });
    }
    _start() {
        this.started = true;
        this.emit("start");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Handle finishing games as hosts.
            this._start();
        });
    }
    _finish(reason, show_ad) {
        this.started = false;
        this.emit("finish", reason, show_ad);
    }
    finish(reason, show_ad) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.hostid) {
                // TODO: Handle finishing games as host.
                this._finish(reason, show_ad);
            }
        });
    }
    registerComponents(object) {
        for (let i = 0; i < object.components.length; i++) {
            const component = object.components[i];
            this.netcomponents.set(component.netid, component);
        }
    }
    /**
     * Find a player by their name.
     */
    getClientByName(name) {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed)
                continue;
            const playerData = this.GameData.GameData.players.get(client.Player.PlayerControl.playerId);
            if (playerData && playerData.name === name) {
                return client;
            }
        }
        return null;
    }
    /**
     * Get a player client by their player ID.
     */
    getClientByPlayerID(playerid) {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed)
                continue;
            if (client.Player.PlayerControl.playerId === playerid) {
                return client;
            }
        }
        return null;
    }
    /**
     * Get a player client by their PlayerControl, PlayerPhysics or CustomNetworkTransform component's network ID.
     */
    getClientByComponent(component) {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed)
                continue;
            if (typeof component === "number") {
                if (client.Player.PlayerControl.netid === component ||
                    client.Player.PlayerPhysics.netid === component ||
                    client.Player.CustomNetworkTransform.netid === component) {
                    return client;
                }
            }
            else {
                if (client.Player.components.some(pc => pc.netid === component.netid)) {
                    return client;
                }
            }
        }
        return null;
    }
    /**
     * Resolve a player by their clientid, player object or by their playercontrol object.
     */
    resolvePlayer(resolvable) {
        if (typeof resolvable === "number") {
            return this.clients.get(resolvable);
        }
        if (resolvable.netid) {
            return this.getClientByComponent(resolvable);
        }
        return resolvable;
    }
    get host() {
        return this.clients.get(this.hostid);
    }
    get me() {
        return this.clients.get(this.client.clientid);
    }
}
