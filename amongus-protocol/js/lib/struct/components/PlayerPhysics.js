import { Component } from "./Component.js";
export class PlayerPhysics extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "Player";
        this.classname = "PlayerPhysics";
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
    }
    OnDeserialize(datalen, data) {
    }
}
