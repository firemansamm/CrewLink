/// <reference types="node" />
import dgram from "dgram";
import { EventEmitter } from "events";
import { DisconnectID, LanguageID, MapID } from "./constants/Enums.js";
import { bitfield } from "./interfaces/Types.js";
import { GameListCount, Packet } from "./interfaces/Packets.js";
import { ServerOptions } from "./interfaces/ServerOptions.js";
import { Game } from "./struct/Game.js";
interface RemoteID {
    nonce: number;
    host: string;
    port: number;
    version: number;
    username: string;
    identified: boolean;
    disconnected: boolean;
    sentDisconnect: "server" | "client";
    info: dgram.RemoteInfo;
    clientid: number;
    pingInterval: PingInterval;
}
export interface AmongusServer {
    on(event: "packet", listener: (remote: RemoteID, packet: Packet) => void): any;
    on(event: "ack", listener: (remote: RemoteID, nonce: number) => void): any;
    on(event: "disconnect", listener: (remote: RemoteID) => void): any;
    on(event: "identify", listener: (remote: RemoteID) => void): any;
}
declare class PingInterval {
    private server;
    remote: RemoteID;
    private stopped;
    constructor(server: AmongusServer, remote: RemoteID);
    next(): Promise<void>;
    stop(): void;
}
export declare class AmongusServer extends EventEmitter {
    socket: dgram.Socket;
    port: number;
    ip: string;
    clients: Map<string, RemoteID>;
    games: Map<number, Game>;
    client_inc: number;
    options: ServerOptions;
    constructor(options?: ServerOptions);
    debug(...fmt: any[]): void;
    log(...fmt: any[]): void;
    incrementClientID(): number;
    identifyRemote(remote: RemoteID, version: number, username: string): boolean;
    countMatches(): GameListCount;
    search(remote: RemoteID, maps?: bitfield | MapID[], imposters?: number, language?: LanguageID): Promise<boolean>;
    rHash(remoteinfo: dgram.RemoteInfo): string;
    handleMessage(message: Buffer, remoteinfo: dgram.RemoteInfo): Promise<void>;
    listen(port: number, host?: string): void;
    awaitPacket(remote: RemoteID, filter: (packet: Packet) => boolean): Promise<Packet>;
    _send(remote: RemoteID, buffer: Buffer): Promise<void>;
    send(remote: RemoteID, packet: Packet): Promise<boolean>;
    ack(remote: RemoteID, nonce: number): Promise<boolean>;
    /**
     * Broadcast a packet to specified remotes, or every remote.
     */
    broadcast(packet: Packet, remotes?: RemoteID[]): Promise<void>;
    /**
     * Disconnect a remote or disconnect the server.
     */
    disconnect(remote?: RemoteID, reason?: DisconnectID, message?: string): Promise<void>;
}
export {};
