import {
    AmongusClient
} from "../Client.js";

import {
    AlterGameTag,
    GameEndReason,
    MessageID,
    PacketID,
    PayloadID,
    RPCID,
    SpawnID
} from "../constants/Enums.js";

import {
    GameOptionsData,
    SceneChangeLocation,
    VotePlayerState
} from "../interfaces/Packets.js";

import { Component } from "./components/Component.js";
import { PlayerControl } from "./components/PlayerControl.js";
import { PlayerPhysics } from "./components/PlayerPhysics.js";
import { CustomNetworkTransform } from "./components/CustomNetworkTransform.js";

import { GameData } from "./objects/GameData.js";
import { GameObject } from "./objects/GameObject.js";
import { LobbyBehaviour } from "./objects/LobbyBehaviour.js";
import { MeetingHub } from "./objects/MeetingHub.js";

import { PlayerClient } from "./PlayerClient.js";

export interface Game {
    on(event: "spawn", listener: (object: GameObject) => void);
    on(event: "playerJoin", listener: (client: PlayerClient) => void);
    on(event: "playerLeave", listener: (client: PlayerClient) => void);
    on(event: "startCount", listener: (count: number) => void);
    on(event: "start", listener: () => void);
    on(event: "finish", listener: (reason: GameEndReason, show_ad: boolean) => void);
    on(event: "chat", listener: (client: PlayerClient, text: string) => void);
    on(event: "setImposters", listener: (imposters: PlayerClient[]) => void);
    on(event: "setImpostors", listener: (impostors: PlayerClient[]) => void);
    on(event: "vote", listener: (voter: PlayerClient, suspect: PlayerClient) => void);
    on(event: "votingComplete", listener: (skipped: boolean, tie: boolean, ejected: PlayerClient, states: Map<number, VotePlayerState>) => void);
    on(event: "murder", listener: (murderer: PlayerClient, target: PlayerClient) => void);
    on(event: "meeting", listener: (emergency: boolean, target: PlayerClient) => void);
    on(event: "sync", listener: (settings: GameOptionsData) => void);
    on(event: "visibility", listener: (visibility: "private"|"public") => void);
    on(event: "sceneChange", listener: (client: PlayerClient, location: SceneChangeLocation) => void);
}

export type PlayerClientResolvable = number|PlayerClient|PlayerControl|PlayerPhysics|CustomNetworkTransform;
export type IDResolvable<T> = number|T;

export class Game extends GameObject {
    ip: string;
    port: number;
    
    code: number;
    hostid: number;

    /**
     * The clients connected to the game, not necessarily spawned.
     */
    clients: Map<number, PlayerClient>;

    /**
     * A shortcut for all components in the game, all with unique net IDs.
     */
    netcomponents: Map<number, Component>;

    /**
     * When the game was instantiated.
     */
    instantiated: number;

    startCount: number;
    startCounterSeq: number;
    started: boolean;

    /**
     * The imposters in the game.
     */
    imposters: PlayerClient[];

    /**
     * The options fo the game, not necessarily synced, use the `sync` event.
     */
    options: GameOptionsData;

    /**
     * The visibility of the game.
     */
    visibility: "private"|"public";

    constructor(protected client: AmongusClient, ip: string, port: number, code: number, hostid: number, clients: number[]) {
        super(client, client);

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

    addChild(object: GameObject) {
        super.addChild(object);
        
        this.registerComponents(object);
        this.emit("spawn", object);
    }

    async awaitSpawns() {
        await this.awaitChild(SpawnID.GameData);

        return await Promise.all([...this.clients.values()].map(client => client.awaitSpawn()));
    }

    get GameData(): GameData {
        return this.children.find(child => child instanceof GameData) as GameData;
    }

    get MeetingHub(): MeetingHub {
        return this.children.find(child => child instanceof MeetingHub) as MeetingHub;
    }

    _syncSettings(options: GameOptionsData) {
        this.options = options;
        this.emit("sync", this.options);
    }

    async syncSettings(options: GameOptionsData) {
        if (this.client.clientid === this.hostid) {
            await this.client.send({
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
    }

    _setImposters(imposters: number[]) {
        this.imposters = imposters.map(imposter => this.getClientByPlayerID(imposter));
        this.emit("setImposters", this.imposters);
        this.emit("setImpostors", this.imposters);
    }

    _setImpostors(impostors: number[]) {
        return this._setImposters(impostors);
    }

    async setImposters(imposters: number[]) {
        if (this.client.clientid === this.hostid) {
            await this.client.send({
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
    }

    async setImpostors(impostors: number[]) {
        return this.setImposters(impostors);
    }

    _setVisibility(visibility: "private"|"public") {
        this.visibility = visibility;
        this.emit("visibility", visibility);
    }

    async setVisibility(visibility: "private"|"public") {
        if (this.client.clientid === this.hostid) {
            await this.client.send({
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
    }

    _setStartCounter(sequence: number, counter: number = -1) {
        if (sequence > this.startCounterSeq) {
            this.startCounterSeq = sequence;
            this.startCount = counter;
            

            this.emit("startCount", counter);
        }
    }

    async setStartCounter(counter) {
        const sequence = this.startCounterSeq + 1;

        if (this.client.clientid === this.hostid) {
            await this.client.send({
                op: PacketID.Reliable,
                payloads:[
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
    }

    _playerJoin(clientid: number) {
        const client = new PlayerClient(this.client, clientid);
        
        this.clients.set(client.clientid, client);
        this.emit("playerJoin", client);
    }

    async playerJoin(clientid: number) {
        if (this.client.clientid === this.hostid) {
            this.setStartCounter(-1);
        }

        this._playerJoin(clientid);
    }

    _sceneChange(clientid: number, location: SceneChangeLocation) {
        const client = this.clients.get(clientid);

        if (client) {
            this.emit("sceneChange", client, location);
            client.emit("sceneChange", location);
        }
    }

    async sceneChange(clientid: number, location: SceneChangeLocation) {
        if (this.client.clientid === this.hostid) {
            const gamedata = await this.awaitChild(SpawnID.GameData) as GameData;
            const lobbybehaviour = await this.awaitChild(SpawnID.LobbyBehaviour) as LobbyBehaviour;

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
    }

    _start() {
        this.started = true;

        this.emit("start");
    }

    async start() {
        // TODO: Handle finishing games as hosts.

        this._start();
    }

    _finish(reason: GameEndReason, show_ad: boolean) {
        this.started = false;
        
        this.emit("finish", reason, show_ad);
    }

    async finish(reason: GameEndReason, show_ad: boolean) {
        if (this.client.clientid === this.hostid) {
            // TODO: Handle finishing games as host.

            this._finish(reason, show_ad);
        }
    }

    registerComponents(object: GameObject) {
        for (let i = 0; i < object.components.length; i++) {
            const component = object.components[i];

            this.netcomponents.set(component.netid, component);
        }
    }
    
    /**
     * Find a player by their name.
     */
    getClientByName(name: string) {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed) continue;

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
    getClientByPlayerID(playerid: number) {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed) continue;

            if (client.Player.PlayerControl.playerId === playerid) {
                return client;
            }
        }

        return null;
    }

    /**
     * Get a player client by their PlayerControl, PlayerPhysics or CustomNetworkTransform component's network ID.
     */
    getClientByComponent<T extends Component>(component: IDResolvable<T>): PlayerClient {
        for (let [clientid, client] of this.clients) {
            if (!client.Player || client.removed) continue;

            if (typeof component === "number") {
                if (client.Player.PlayerControl.netid === component ||
                    client.Player.PlayerPhysics.netid === component ||
                    client.Player.CustomNetworkTransform.netid === component) {
                    return client;
                }
            } else {
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
    resolvePlayer(resolvable: PlayerClientResolvable): PlayerClient {
        if (typeof resolvable === "number") {
            return this.clients.get(resolvable);
        }

        if ((resolvable as Component).netid) {
            return this.getClientByComponent(resolvable as Component);
        }

        return resolvable as PlayerClient;
    }

    get host() {
        return this.clients.get(this.hostid);
    }

    get me() {
        return this.clients.get(this.client.clientid);
    }
}