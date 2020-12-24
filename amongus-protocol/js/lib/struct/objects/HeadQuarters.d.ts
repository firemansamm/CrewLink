import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { ShipStatus } from "../components/ShipStatus.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { Game } from "../Game.js";
export declare class HeadQuarters extends GameObject {
    spawnid: SpawnID.HeadQuarters;
    components: [ShipStatus];
    constructor(client: AmongusClient, parent: Game, components: Partial<ComponentData>[]);
    get ShipStatus(): ShipStatus;
}
