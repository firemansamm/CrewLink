import { EventEmitter } from "events";
export class Component extends EventEmitter {
    constructor(client, netid) {
        super();
        this.client = client;
        this.netid = netid;
    }
    OnSpawn(datalen, data) { }
    OnDeserialize(datalen, data) { }
    Serialize(...args) {
        return Buffer.alloc(0);
    }
}
