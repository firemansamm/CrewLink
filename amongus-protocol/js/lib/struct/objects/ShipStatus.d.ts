import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { ShipStatus as ShipStatusComponent } from "../components/ShipStatus.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { Game } from "../Game.js";
export declare class ShipStatus extends GameObject {
    spawnid: SpawnID.ShipStatus;
    components: [ShipStatusComponent];
    constructor(client: AmongusClient, parent: Game, components: Partial<ComponentData>[]);
    get ShipStatus(): ShipStatusComponent;
}
