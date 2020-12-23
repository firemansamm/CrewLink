/// <reference types="node" />
import dgram from "dgram";
import { EventEmitter } from "events";
import { GameListGame, Packet, Payload, GameOptionsData } from "./interfaces/Packets.js";
import { LanguageID, MapID } from "./constants/Enums.js";
import { Game } from "./struct/Game.js";
import { bitfield } from "./interfaces/Types.js";
import { JoinOptions } from "./interfaces/JoinOptions.js";
import { ClientOptions } from "./interfaces/ClientOptions.js";
import { DebugOptions } from "./constants/DebugOptions.js";
export declare interface AmongusClient {
    on(event: "packet", listener: (packet: Packet) => void): any;
    off(event: "packet", listener: (packet: Packet) => void): any;
    on(event: "disconnect", listener: () => void): any;
    off(event: "disconnect", listener: () => void): any;
    on(event: "connected", listener: () => void): any;
    off(event: "connected", listener: () => void): any;
}
export declare class AmongusClient extends EventEmitter {
    options: ClientOptions;
    socket: dgram.Socket;
    id: number;
    /**
     * The IP that the client is connected to.
     */
    ip: string;
    /**
     * The port that the client is connected to.
     */
    port: number;
    /**
     * The incrementing nonce for the client.
     */
    nonce: number;
    /**
     * The username of the client.
     */
    username: string;
    /**
     * The version of the client.
     */
    version: number;
    /**
     * The current game of the client.
     */
    game: Game;
    /**
     * The client ID of the client given after joining a game.
     */
    clientid: number;
    constructor(options?: ClientOptions);
    /**
     * Print a debug message if the debug option is enabled.
     */
    debug(debugOpt: DebugOptions, ...fmt: any[]): void;
    _disconnect(): void;
    /**
     * Disconnect from the currently connected server.
     */
    disconnect(reason?: number, message?: string): Promise<void>;
    _connect(ip: string, port: number): void;
    /**
     * Connect to a server IP and port.
     * @param username The username to connect with.
     * @param version The client version to connect with. (see the GameVersions enum)
     */
    connect(ip: string, port: number, username: string, version?: number): Promise<boolean | number>;
    _send(buffer: Buffer): Promise<void>;
    /**
     * Wait for a packet to be received from the server.
     */
    awaitPacket(filter: (packet: Packet) => boolean): Promise<Packet | null>;
    /**
     * Wait for a payload to be received from the server.
     */
    awaitPayload(filter: (payload: Payload) => boolean): Promise<Payload | null>;
    /**
     * Send a packet to the server and wait for an acknowledgment with respect to disconnects.
     */
    send(packet: Packet): Promise<boolean>;
    ack(nonce: number): Promise<void>;
    /**
     * Say hello to the server.
     */
    hello(username: string, version?: number): Promise<boolean>;
    /**
     * Join a game by it's V6 code.
     */
    join(code: string | number, options?: JoinOptions): Promise<Game>;
    /**
     * Spawn the player in the joined game.
     */
    spawn(): Promise<void>;
    /**
     * Search for game using specified settings.
     */
    search(maps?: bitfield | MapID[], imposters?: number, language?: LanguageID): Promise<GameListGame[]>;
    /**
     * WIP: Host a game and control game data.
     */
    host(options?: Partial<GameOptionsData>): any;
}
