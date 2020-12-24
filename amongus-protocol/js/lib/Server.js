var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dgram from "dgram";
import util from "util";
import crypto from "crypto";
import { EventEmitter } from "events";
import { DisconnectID, LanguageID, MapID, PacketID, PayloadID } from "./constants/Enums.js";
import { parsePacket } from "./Parser.js";
import { composePacket } from "./Compose.js";
import { GameListClientBoundTag } from "./interfaces/Packets.js";
import { DecodeVersion, FormatVersion } from "./util/Versions.js";
class PingInterval {
    constructor(server, remote) {
        this.server = server;
        this.remote = remote;
        this.stopped = false;
        setTimeout(this.next.bind(this), this.server.options.pingInterval);
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.remote.identified && !this.stopped) {
                this.server.log("Pinging %s", this.remote.host + ":" + this.remote.port);
                if (yield this.server.send(this.remote, {
                    op: PacketID.Ping,
                    nonce: this.remote.nonce
                })) {
                    if (!this.remote.disconnected) {
                        setTimeout(this.next.bind(this), this.server.options.pingInterval);
                    }
                }
            }
        });
    }
    stop() {
        this.stopped = true;
    }
}
export class AmongusServer extends EventEmitter {
    constructor(options = {}) {
        super();
        this.socket = null;
        this.port = null;
        this.ip = null;
        this.clients = new Map;
        this.client_inc = 0;
        this.options = Object.assign({ debug: false, logs: false, ackInterval: 1500, disconnectTimeout: 6000, versions: ["2020.9.7"], pingInterval: 1500 }, options);
    }
    debug(...fmt) {
        if (this.options.debug)
            console.log(...fmt);
    }
    log(...fmt) {
        const date = new Date();
        const ms = "0".repeat(4 - date.getMilliseconds().toString().length) + date.getMilliseconds();
        const fmtdate = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + ms;
        if (this.options.logs)
            console.log("[" + fmtdate + "]", util.format(fmt[0], ...fmt.slice(1)));
    }
    incrementClientID() {
        this.client_inc++;
        if (this.client_inc > Math.pow(2, 32) - 1) {
            this.client_inc = 0;
        }
        return this.client_inc;
    }
    identifyRemote(remote, version, username) {
        const correct_version = !!~this.options.versions.indexOf(FormatVersion(DecodeVersion(version)));
        if (correct_version) {
            remote.version = version;
            remote.username = username;
            remote.clientid = this.incrementClientID();
            remote.identified = true;
            if (remote.pingInterval) {
                remote.pingInterval.stop();
            }
            remote.pingInterval = new PingInterval(this, remote);
            this.emit("identify", remote);
        }
        return correct_version;
    }
    countMatches() {
        const count = {
            [MapID.TheSkeld]: 0,
            [MapID.MiraHQ]: 0,
            [MapID.Polus]: 0
        };
        for (let [code, game] of this.games) {
            if (game.visibility === "public") {
                game[game.options.mapID]++;
            }
        }
        return count;
    }
    search(remote, maps = 0x07, imposters = 0, language = LanguageID.Any) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(maps)) {
                return yield this.search(remote, maps.reduce((val, map) => val + (1 << map), 0), imposters, language);
            }
            if (remote.identified) {
                const count = this.countMatches();
                yield this.send(remote, {
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GetGameListV2,
                            tag: GameListClientBoundTag.Count,
                            count
                        }
                    ]
                });
                const found_games = [];
                for (let [code, game] of this.games) {
                    if (maps & (1 << game.options.mapID)) {
                        if (imposters === 0 || imposters === game.options.imposterCount) {
                            if (language === LanguageID.Any || language === game.options.language) {
                                found_games.push(game);
                            }
                        }
                    }
                }
                const code = Buffer.alloc(4);
                code.writeUInt32LE(0xdd44be99);
                yield this.send(remote, {
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GetGameListV2,
                            tag: GameListClientBoundTag.List,
                            games: found_games.map(game => {
                                return {
                                    ip: game.ip,
                                    port: game.port,
                                    code: game.code,
                                    name: game.host.Player.PlayerControl.name,
                                    num_players: game.clients.size,
                                    age: 0,
                                    map: game.options.mapID,
                                    imposters: game.options.imposterCount,
                                    max_players: game.options.maxPlayers
                                };
                            })
                        }
                    ]
                });
            }
        });
    }
    rHash(remoteinfo) {
        return crypto.createHash("sha256").update(remoteinfo.address + ":" + remoteinfo.port).digest("hex");
    }
    handleMessage(message, remoteinfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const rhash = this.rHash(remoteinfo);
            if (!this.clients.has(rhash)) {
                this.clients.set(rhash, {
                    nonce: 1,
                    host: remoteinfo.address,
                    port: remoteinfo.port,
                    version: null,
                    username: null,
                    sentDisconnect: null,
                    info: remoteinfo,
                    clientid: null,
                    identified: false,
                    disconnected: false,
                    pingInterval: null
                });
            }
            const remote = this.clients.get(rhash);
            const packet = parsePacket(message, "server");
            this.debug("Received packet ", message, packet);
            if (packet.bound === "server") {
                switch (packet.op) {
                    case PacketID.Reliable:
                        if (remote.identified && !remote.disconnected) {
                            for (let i = 0; i < packet.payloads.length; i++) {
                                const payload = packet.payloads[i];
                                payload.bound = packet.bound;
                                if (payload.bound === "server") {
                                    switch (payload.payloadid) {
                                        case PayloadID.GetGameListV2:
                                            yield this.search(remote, payload.options.mapID, payload.options.imposterCount, payload.options.language);
                                            break;
                                    }
                                }
                            }
                        }
                        break;
                    case PacketID.Hello:
                        if (this.identifyRemote(remote, packet.clientver, packet.username)) {
                            this.log("Remote %s identified as \"%s\" (%s, %s)", remote.host + ":" + remote.port, remote.username, "Client ver: " + FormatVersion(DecodeVersion(remote.version)), "Client ID: " + remote.clientid);
                        }
                        else {
                            yield this.disconnect(remote, DisconnectID.IncorrectVersion);
                        }
                        break;
                    case PacketID.Disconnect:
                        if (remote.identified) {
                            yield this.disconnect(remote);
                        }
                        break;
                    case PacketID.Ping:
                        if (remote.identified && !remote.disconnected) {
                            yield this.ack(remote, packet.nonce);
                        }
                        break;
                }
                if (packet.reliable) {
                    yield this.ack(remote, packet.nonce);
                }
                this.emit("packet", remote, packet);
            }
        });
    }
    listen(port, host = "0.0.0.0") {
        if (this.socket) {
            this.disconnect();
            return;
        }
        this.port = port;
        this.ip = host;
        this.socket = dgram.createSocket("udp4");
        this.socket.bind(this.port, this.ip);
        this.socket.on("listening", () => {
            this.log("Listening on", host + ":" + port, "(locally available at 127.0.0.1:" + this.port + ")");
            this.emit("listening", port, host);
        });
        this.socket.on("message", this.handleMessage.bind(this));
    }
    awaitPacket(remote, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _this = this;
            return new Promise((resolve, reject) => {
                function onPacket(_remote, packet) {
                    if (_remote === remote && filter(packet)) {
                        _this.off("disconnect", onDisconnect);
                        _this.off("packet", onPacket);
                        resolve(packet);
                    }
                }
                function onDisconnect(_remote) {
                    if (_remote === remote) {
                        _this.off("disconnect", onDisconnect);
                        _this.off("packet", onPacket);
                        resolve(null);
                    }
                }
                this.on("packet", onPacket);
                this.on("disconnect", onDisconnect);
            });
        });
    }
    _send(remote, buffer) {
        return new Promise((resolve, reject) => {
            this.socket.send(buffer, remote.port, remote.host, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    send(remote, packet) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = remote.nonce;
            switch (packet.op) {
                case PacketID.Reliable:
                case PacketID.Hello:
                case PacketID.Ping:
                    packet.reliable = true;
                    packet.nonce = nonce;
                    remote.nonce++;
                    break;
            }
            const composed = composePacket(packet, "client");
            yield this._send(remote, composed);
            this.debug("Sent packet", composed);
            if (packet.reliable) {
                const interval = setInterval(() => {
                    this._send(remote, composed);
                }, this.options.ackInterval);
                this.debug("Awaiting acknowledege", nonce);
                const ack = yield this.awaitPacket(remote, packet => {
                    return packet.op === PacketID.Acknowledge
                        && packet.nonce === nonce;
                });
                this.debug("Recieved acknowledege", nonce);
                clearInterval(interval);
                return ack !== null;
            }
            else {
                return true;
            }
        });
    }
    ack(remote, nonce) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.send(remote, {
                op: PacketID.Acknowledge,
                nonce: nonce
            });
        });
    }
    /**
     * Broadcast a packet to specified remotes, or every remote.
     */
    broadcast(packet, remotes = [...this.clients.values()]) {
        return __awaiter(this, void 0, void 0, function* () {
            // await Promise.allSettled(remotes.map(remote => this.send(remote, packet)));
        });
    }
    /**
     * Disconnect a remote or disconnect the server.
     */
    disconnect(remote, reason = DisconnectID.Destroy, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const rhash = this.rHash(remote.info);
            if (remote) {
                if (remote.sentDisconnect === "client") {
                    yield this.send(remote, {
                        op: PacketID.Disconnect,
                        reason,
                        message
                    });
                    remote.disconnected = true;
                    this.clients.delete(rhash);
                }
                else if (!remote.sentDisconnect) {
                    remote.sentDisconnect = "server";
                    yield this.send(remote, {
                        op: PacketID.Disconnect,
                        reason,
                        message
                    });
                    const disconnecttimeout = setTimeout(() => {
                        remote.disconnected = true;
                        this.clients.delete(rhash);
                    }, this.options.disconnectTimeout);
                    yield this.awaitPacket(remote, packet => packet.op === PacketID.Disconnect);
                    clearTimeout(disconnecttimeout);
                    remote.disconnected = true;
                    this.clients.delete(rhash);
                }
            }
            this.log("Broadcasting disconnect to " + this.clients.size + " clients..");
            yield this.broadcast({
                op: PacketID.Disconnect,
                reason,
                message
            });
            this.clients.clear();
        });
    }
}
