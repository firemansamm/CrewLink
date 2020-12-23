import { SystemType } from "../../constants/Enums.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { SystemStatus } from "./SystemStatus.js";
export class SabotageSystem extends SystemStatus {
    constructor() {
        super();
        this.type = SystemType.Sabotage;
        this.timer = 0;
    }
    OnSpawn(reader) {
        return this.OnDeserialize(reader);
    }
    OnDeserialize(reader) {
        this.timer = reader.floatLE();
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.floatLE(this.timer);
        return writer.buffer;
    }
}
