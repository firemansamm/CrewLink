import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { MeetingHud } from "../components/MeetingHud.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { Game } from "../Game.js";
export declare class MeetingHub extends GameObject {
    spawnid: SpawnID.MeetingHub;
    components: [MeetingHud];
    constructor(client: AmongusClient, parent: Game, components: Partial<ComponentData>[]);
    get MeetingHud(): MeetingHud;
}
