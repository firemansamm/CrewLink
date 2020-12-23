/// <reference types="node" />
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
import { SystemStatus } from "./SystemStatus.js";
export declare class ReactorSystem extends SystemStatus {
    type: SystemType.Reactor;
    countdown: number;
    pairs: [number, number][];
    constructor();
    get UserCount(): number;
    OnSpawn(reader: BufferReader): void;
    OnDeserialize(reader: BufferReader): void;
    Serialize(): Buffer;
}
