/// <reference types="node" />
import { DeconState, SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
import { SystemStatus } from "./SystemStatus.js";
export declare class DeconSystem extends SystemStatus {
    type: SystemType.Decontamination;
    timer: number;
    state: DeconState;
    constructor();
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(): Buffer;
}
