/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
import { ParsedPlayerGameData } from "../../interfaces/Packets.js";
export interface GameData {
    on(event: "playerData", listener: (data: ParsedPlayerGameData) => void): any;
}
export declare class GameData extends Component {
    name: "GameData";
    classname: "GameData";
    players: Map<number, ParsedPlayerGameData>;
    dirty_bits: number;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(): Buffer;
    UpdatePlayers(players: ParsedPlayerGameData[]): void;
}
