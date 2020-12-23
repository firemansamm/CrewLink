import { GameObject } from "./GameObject.js";
import { FollowerCamera } from "../components/FollowerCamera.js";
import { SpawnID } from "../../constants/Enums.js";
export class LobbyBehaviour extends GameObject {
    constructor(client, parent, components) {
        super(client, parent);
        this.spawnid = SpawnID.LobbyBehaviour;
        this.id = null;
        this.components = [
            new FollowerCamera(client, components[0].netid, components[0].datalen, components[0].data)
        ];
        if (parent instanceof GameObject) {
            parent.addChild(this);
        }
    }
    get FollowerCamera() {
        return this.components[0];
    }
}
