import { DeconState, SystemType } from "../../constants/Enums.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { SystemStatus } from "./SystemStatus.js";
export class DeconSystem extends SystemStatus {
    constructor() {
        super();
        this.type = SystemType.Decontamination;
        this.timer = 0;
        this.state = DeconState.Idle;
    }
    OnSpawn(reader) {
        return this.OnDeserialize(reader);
    }
    OnDeserialize(reader) {
        this.timer = reader.byte();
        this.state = reader.byte();
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.byte(this.timer);
        writer.byte(this.state);
        return writer.buffer;
    }
}
