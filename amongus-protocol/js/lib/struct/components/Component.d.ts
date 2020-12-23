/// <reference types="node" />
import { EventEmitter } from "events";
import { AmongusClient } from "../../Client.js";
export declare class Component extends EventEmitter {
    client: AmongusClient;
    netid: number;
    name: string;
    classname: string;
    constructor(client: AmongusClient, netid: number);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(...args: any[]): Buffer;
}
