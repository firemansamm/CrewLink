import { GameObject } from "./GameObject.js";
import { MeetingHud } from "../components/MeetingHud.js";
import { SpawnID } from "../../constants/Enums.js";
export class MeetingHub extends GameObject {
    constructor(client, parent, components) {
        super(client, parent);
        this.spawnid = SpawnID.MeetingHub;
        this.id = null;
        this.components = [
            new MeetingHud(client, components[0].netid, components[0].datalen, components[0].data)
        ];
        if (parent instanceof GameObject) {
            parent.addChild(this);
        }
    }
    get MeetingHud() {
        return this.components[0];
    }
}
