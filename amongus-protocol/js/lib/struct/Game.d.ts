import { AmongusClient } from "../Client.js";
import { GameEndReason } from "../constants/Enums.js";
import { GameOptionsData, SceneChangeLocation, VotePlayerState } from "../interfaces/Packets.js";
import { Component } from "./components/Component.js";
import { PlayerControl } from "./components/PlayerControl.js";
import { PlayerPhysics } from "./components/PlayerPhysics.js";
import { CustomNetworkTransform } from "./components/CustomNetworkTransform.js";
import { GameData } from "./objects/GameData.js";
import { GameObject } from "./objects/GameObject.js";
import { MeetingHub } from "./objects/MeetingHub.js";
import { PlayerClient } from "./PlayerClient.js";
export interface Game {
    on(event: "spawn", listener: (object: GameObject) => void): any;
    on(event: "playerJoin", listener: (client: PlayerClient) => void): any;
    on(event: "playerLeave", listener: (client: PlayerClient) => void): any;
    on(event: "startCount", listener: (count: number) => void): any;
    on(event: "start", listener: () => void): any;
    on(event: "finish", listener: (reason: GameEndReason, show_ad: boolean) => void): any;
    on(event: "chat", listener: (client: PlayerClient, text: string) => void): any;
    on(event: "setImposters", listener: (imposters: PlayerClient[]) => void): any;
    on(event: "setImpostors", listener: (impostors: PlayerClient[]) => void): any;
    on(event: "vote", listener: (voter: PlayerClient, suspect: PlayerClient) => void): any;
    on(event: "votingComplete", listener: (skipped: boolean, tie: boolean, ejected: PlayerClient, states: Map<number, VotePlayerState>) => void): any;
    on(event: "murder", listener: (murderer: PlayerClient, target: PlayerClient) => void): any;
    on(event: "meeting", listener: (emergency: boolean, target: PlayerClient) => void): any;
    on(event: "sync", listener: (settings: GameOptionsData) => void): any;
    on(event: "visibility", listener: (visibility: "private" | "public") => void): any;
    on(event: "sceneChange", listener: (client: PlayerClient, location: SceneChangeLocation) => void): any;
}
export declare type PlayerClientResolvable = number | PlayerClient | PlayerControl | PlayerPhysics | CustomNetworkTransform;
export declare type IDResolvable<T> = number | T;
export declare class Game extends GameObject {
    protected client: AmongusClient;
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
    visibility: "private" | "public";
    constructor(client: AmongusClient, ip: string, port: number, code: number, hostid: number, clients: number[]);
    get age(): number;
    get impostors(): PlayerClient[];
    addChild(object: GameObject): void;
    awaitSpawns(): Promise<import("amongus-protocol/ts/objects").Player[]>;
    get GameData(): GameData;
    get MeetingHub(): MeetingHub;
    _syncSettings(options: GameOptionsData): void;
    syncSettings(options: GameOptionsData): Promise<void>;
    _setImposters(imposters: number[]): void;
    _setImpostors(impostors: number[]): void;
    setImposters(imposters: number[]): Promise<void>;
    setImpostors(impostors: number[]): Promise<void>;
    _setVisibility(visibility: "private" | "public"): void;
    setVisibility(visibility: "private" | "public"): Promise<void>;
    _setStartCounter(sequence: number, counter?: number): void;
    setStartCounter(counter: any): Promise<void>;
    _playerJoin(clientid: number): void;
    playerJoin(clientid: number): Promise<void>;
    _sceneChange(clientid: number, location: SceneChangeLocation): void;
    sceneChange(clientid: number, location: SceneChangeLocation): Promise<void>;
    _start(): void;
    start(): Promise<void>;
    _finish(reason: GameEndReason, show_ad: boolean): void;
    finish(reason: GameEndReason, show_ad: boolean): Promise<void>;
    registerComponents(object: GameObject): void;
    /**
     * Find a player by their name.
     */
    getClientByName(name: string): PlayerClient;
    /**
     * Get a player client by their player ID.
     */
    getClientByPlayerID(playerid: number): PlayerClient;
    /**
     * Get a player client by their PlayerControl, PlayerPhysics or CustomNetworkTransform component's network ID.
     */
    getClientByComponent<T extends Component>(component: IDResolvable<T>): PlayerClient;
    /**
     * Resolve a player by their clientid, player object or by their playercontrol object.
     */
    resolvePlayer(resolvable: PlayerClientResolvable): PlayerClient;
    get host(): PlayerClient;
    get me(): PlayerClient;
}
