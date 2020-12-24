/// <reference types="node" />
import { EventEmitter } from "events";
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
export declare class SystemStatus extends EventEmitter {
    type: SystemType;
    constructor();
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(...args: any[]): Buffer;
}
