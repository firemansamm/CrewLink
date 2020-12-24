/// <reference types="node" />
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
import { SystemStatus } from "./SystemStatus.js";
export declare class HQHudOverrideSystem extends SystemStatus {
    type: SystemType.Communications;
    consoles: [number, number][];
    fixed_consoles: number[];
    constructor();
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(): Buffer;
}
