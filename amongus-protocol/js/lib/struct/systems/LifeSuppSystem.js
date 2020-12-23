import { SystemType } from "../../constants/Enums.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { SystemStatus } from "./SystemStatus.js";
export class LifeSuppSystem extends SystemStatus {
    constructor() {
        super();
        this.type = SystemType.O2;
        this.countdown = 10000;
        this.consoles = [];
    }
    OnSpawn(reader) {
        return this.OnDeserialize(reader);
    }
    OnDeserialize(reader) {
        this.countdown = reader.floatLE();
        this.consoles = [];
        if (reader.offset < reader.size) {
            const num_consoles = reader.packed();
            for (let i = 0; i < num_consoles; i++) {
                this.consoles.push(reader.packed());
            }
        }
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.floatLE(this.countdown);
        writer.packed(this.consoles.length);
        for (let i = 0; i < this.consoles.length; i++) {
            writer.packed(this.consoles[i]);
        }
        return writer.buffer;
    }
}
