import { AmongusClient } from "../../Client.js"

import { GameObject } from "./GameObject.js"

import { ShipStatus as ShipStatusComponent } from "../components/ShipStatus.js"

import {
    SpawnID,
    SystemType
} from "../../constants/Enums.js"

import { ComponentData } from "../../interfaces/Packets.js"
import { Game } from "../Game.js"

import { SwitchSystem } from "../systems/SwitchSystem.js";
import { MedScanSystem } from "../systems/MedScanSystem.js";
import { ReactorSystem } from "../systems/ReactorSystem.js";
import { LifeSuppSystem } from "../systems/LifeSuppSystem.js";
import { SecuritySystem } from "../systems/SecuritySystem.js";
import { HudOverrideSystem } from "../systems/HudOverrideSystem.js";
import { DoorsSystem } from "../systems/DoorsSystem.js";
import { SabotageSystem } from "../systems/SabotageSystem.js";

export class ShipStatus extends GameObject {
    spawnid: SpawnID.ShipStatus;
    components: [ShipStatusComponent];

    constructor (client: AmongusClient, parent: Game, components: Partial<ComponentData>[]) {
        super(client, parent);

        this.spawnid = SpawnID.ShipStatus;

        this.id = null;

        this.components = [
            new ShipStatusComponent(client, components[0].netid)
        ];

        this.ShipStatus.systems = {
            [SystemType.Reactor]: new ReactorSystem,
            [SystemType.Electrical]: new SwitchSystem,
            [SystemType.O2]: new LifeSuppSystem,
            [SystemType.MedBay]: new MedScanSystem,
            [SystemType.Security]: new SecuritySystem,
            [SystemType.Communications]: new HudOverrideSystem,
            [SystemType.Doors]: new DoorsSystem,
            [SystemType.Sabotage]: new SabotageSystem
        }

        this.ShipStatus.systems[SystemType.Doors].SetDoors(13);
        this.ShipStatus.OnSpawn(components[0].datalen, components[0].data);
        
        if (parent instanceof GameObject) {
            parent.addChild(this);
        }
    }

    get ShipStatus() {
        return this.components[0];
    }
}