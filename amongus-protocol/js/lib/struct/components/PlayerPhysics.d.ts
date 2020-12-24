/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
export declare class PlayerPhysics extends Component {
    name: "Player";
    classname: "PlayerPhysics";
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
}
