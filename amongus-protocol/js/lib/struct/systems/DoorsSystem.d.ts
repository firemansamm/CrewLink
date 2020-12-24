/// <reference types="node" />
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
import { SystemStatus } from "./SystemStatus.js";
export declare class DoorsSystem extends SystemStatus {
    type: SystemType.Doors;
    doors: boolean[];
    constructor();
    SetDoors(num: number): void;
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(): Buffer;
}
