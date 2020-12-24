import { Component } from "./Component.js";
export class FollowerCamera extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "LobbyBehaviour";
        this.classname = "FollowerCamera";
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
    }
    OnDeserialize(datalen, data) {
    }
    Serialize() {
        return Buffer.alloc(0x00);
    }
}
