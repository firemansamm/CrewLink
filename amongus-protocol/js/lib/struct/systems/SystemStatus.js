import { EventEmitter } from "events";
export class SystemStatus extends EventEmitter {
    constructor() {
        super();
    }
    OnSpawn(reader) { }
    OnDeserialize(reader) { }
    Serialize(...args) {
        return Buffer.alloc(0);
    }
}
