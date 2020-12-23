/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
export interface VoteBanSystem {
    on(event: "update", listener: (votes: Map<number, number[]>) => void): any;
}
export declare class VoteBanSystem extends Component {
    name: "GameData";
    classname: "VoteBanSystem";
    /**
     * A map of clients who have been voted, with the value being an array of players who voted.
     */
    votes: Map<number, number[]>;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(): Buffer;
}
