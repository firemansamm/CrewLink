import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { FollowerCamera } from "../components/FollowerCamera.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { Game } from "../Game.js";
export declare class LobbyBehaviour extends GameObject {
    spawnid: SpawnID.LobbyBehaviour;
    components: [FollowerCamera];
    constructor(client: AmongusClient, parent: Game, components: Partial<ComponentData>[]);
    get FollowerCamera(): FollowerCamera;
}
