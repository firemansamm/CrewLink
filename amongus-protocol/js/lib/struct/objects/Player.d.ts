import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { CustomNetworkTransform } from "../components/CustomNetworkTransform.js";
import { PlayerControl } from "../components/PlayerControl.js";
import { PlayerPhysics } from "../components/PlayerPhysics.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { PlayerClient } from "../PlayerClient.js";
export declare class Player extends GameObject {
    spawnid: SpawnID.Player;
    components: [PlayerControl, PlayerPhysics, CustomNetworkTransform];
    constructor(client: AmongusClient, parent: PlayerClient, components: Partial<ComponentData>[]);
    get PlayerControl(): PlayerControl;
    get PlayerPhysics(): PlayerPhysics;
    get CustomNetworkTransform(): CustomNetworkTransform;
}
