/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
import { SystemType } from "../../constants/Enums.js";
import { SwitchSystem } from "../systems/SwitchSystem.js";
import { MedScanSystem } from "../systems/MedScanSystem.js";
import { ReactorSystem } from "../systems/ReactorSystem.js";
import { LifeSuppSystem } from "../systems/LifeSuppSystem.js";
import { SecuritySystem } from "../systems/SecuritySystem.js";
import { HQHudOverrideSystem } from "../systems/HQHudOverrideSystem.js";
import { HudOverrideSystem } from "../systems/HudOverrideSystem.js";
import { DoorsSystem } from "../systems/DoorsSystem.js";
import { SabotageSystem } from "../systems/SabotageSystem.js";
import { DeconSystem } from "../systems/DeconSystem.js";
export declare class ShipStatus extends Component {
    name: "ShipStatus";
    classname: "ShipStatus";
    systems: Partial<{
        [SystemType.Reactor]: ReactorSystem;
        [SystemType.Electrical]: SwitchSystem;
        [SystemType.O2]: LifeSuppSystem;
        [SystemType.MedBay]: MedScanSystem;
        [SystemType.Security]: SecuritySystem;
        [SystemType.Communications]: HQHudOverrideSystem | HudOverrideSystem;
        [SystemType.Doors]: DoorsSystem;
        [SystemType.Sabotage]: SabotageSystem;
        [SystemType.Decontamination]: DeconSystem;
        [SystemType.Laboratory]: ReactorSystem;
    }>;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): void;
    OnDeserialize(datalen: number, data: Buffer): void;
}
