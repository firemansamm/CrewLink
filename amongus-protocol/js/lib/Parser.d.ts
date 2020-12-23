import { Packet, GameOptionsData, DisconnectReason, ParsedPlayerGameData } from "./interfaces/Packets.js";
import { BufferReader } from "./util/BufferReader.js";
export declare function parseGameOptions(reader: BufferReader): GameOptionsData;
export declare function parseDisconnect(reader: BufferReader): DisconnectReason;
export declare function parsePlayerData(reader: BufferReader): ParsedPlayerGameData;
export declare function parsePacket(buffer: any, bound?: "server" | "client"): Packet;
