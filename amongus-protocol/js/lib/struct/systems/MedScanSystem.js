import { SystemType } from "../../constants/Enums.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { SystemStatus } from "./SystemStatus.js";
export class MedScanSystem extends SystemStatus {
    constructor() {
        super();
        this.type = SystemType.MedBay;
        this.users = [];
    }
    OnSpawn(reader) {
        return this.OnDeserialize(reader);
    }
    OnDeserialize(reader) {
        const num_users = reader.packed();
        this.users = reader.bytes(num_users);
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.packed(this.users.length);
        writer.bytes(this.users);
        return writer.buffer;
    }
}
