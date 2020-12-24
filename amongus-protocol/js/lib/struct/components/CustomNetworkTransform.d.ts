/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
import { Vector2 } from "../../interfaces/Types.js";
export interface CustomNetworkTransform extends Component {
    on(event: "move", listener: (transform: CustomNetworkTransform) => void): any;
}
export declare class CustomNetworkTransform extends Component {
    name: "Player";
    classname: "CustomNetworkTransform";
    sequence: number;
    position: Vector2;
    velocity: Vector2;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    SidGreater(newSid: any): boolean;
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(): Buffer;
    move(position: Vector2, velocity: Vector2): Promise<void>;
    snapTo(position: Vector2): Promise<void>;
}
