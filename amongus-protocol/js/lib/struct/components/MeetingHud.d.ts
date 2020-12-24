/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
import { VotePlayerState } from "../../interfaces/Packets.js";
export interface MeetingHud {
    on(event: "update", listener: (states: Map<number, VotePlayerState>) => void): any;
}
export declare class MeetingHud extends Component {
    name: "MeetingHub";
    classname: "MeetingHud";
    states: Map<number, VotePlayerState>;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): number;
}
