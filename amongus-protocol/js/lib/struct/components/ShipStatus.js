import { Component } from "./Component.js";
import { SystemType } from "../../constants/Enums.js";
import { BufferReader } from "../../util/BufferReader.js";
export class ShipStatus extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "ShipStatus";
        this.classname = "ShipStatus";
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
        const reader = new BufferReader(data);
        for (let i = 0; i < 30; i++) {
            if (this.systems[i]) {
                const system = this.systems[i];
                system.OnSpawn(reader);
            }
        }
    }
    OnDeserialize(datalen, data) {
        const reader = new BufferReader(data);
        const updateMask = reader.packed();
        for (let i = 0; i < 30; i++) {
            if ((updateMask & (1 << i)) !== 0) {
                if (this.systems[i]) {
                    const system = this.systems[i];
                    system.OnDeserialize(reader);
                }
            }
        }
    }
}
