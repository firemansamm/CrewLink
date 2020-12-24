import { SystemType } from "../../constants/Enums.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { SystemStatus } from "./SystemStatus.js";
export class HudOverrideSystem extends SystemStatus {
    constructor() {
        super();
        this.type = SystemType.Communications;
        this.is_active = false;
    }
    OnSpawn(reader) {
        return this.OnDeserialize(reader);
    }
    OnDeserialize(reader) {
        this.is_active = reader.bool();
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.bool(this.is_active);
        return writer.buffer;
    }
}
