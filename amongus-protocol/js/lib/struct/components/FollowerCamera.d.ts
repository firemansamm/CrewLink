/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
export declare class FollowerCamera extends Component {
    name: "LobbyBehaviour";
    classname: "FollowerCamera";
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(): Buffer;
}
