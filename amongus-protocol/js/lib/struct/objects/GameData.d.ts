import { AmongusClient } from "../../Client.js";
import { GameObject } from "./GameObject.js";
import { GameData as GameDataComponent } from "../components/GameData.js";
import { VoteBanSystem } from "../components/VoteBanSystem.js";
import { SpawnID } from "../../constants/Enums.js";
import { ComponentData } from "../../interfaces/Packets.js";
import { Game } from "../Game.js";
export declare class GameData extends GameObject {
    spawnid: SpawnID.GameData;
    components: [GameDataComponent, VoteBanSystem];
    constructor(client: AmongusClient, parent: Game, components: Partial<ComponentData>[]);
    get GameData(): GameDataComponent;
    get VoteBanSystem(): VoteBanSystem;
}
