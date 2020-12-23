/// <reference types="node" />
import { GameOptionsData, Packet } from "./interfaces/Packets.js";
import { BufferWriter } from "./util/BufferWriter.js";
export declare function composeGameOptions(options: Partial<GameOptionsData>): BufferWriter;
export declare function composePacket(packet: Packet, bound?: "server" | "client"): Buffer;
