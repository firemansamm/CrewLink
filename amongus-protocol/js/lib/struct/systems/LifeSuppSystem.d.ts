/// <reference types="node" />
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
import { SystemStatus } from "./SystemStatus.js";
export declare class LifeSuppSystem extends SystemStatus {
    type: SystemType.O2;
    countdown: number;
    consoles: number[];
    constructor();
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(): Buffer;
}
