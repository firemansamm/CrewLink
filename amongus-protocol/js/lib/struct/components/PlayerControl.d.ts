/// <reference types="node" />
import { AmongusClient } from "../../Client.js";
import { Component } from "./Component.js";
import { uint8 } from "../../interfaces/Types.js";
import { ColourID, HatID, PetID, SkinID } from "../../../index.js";
interface PlayerControlOnSpawn {
    isNew: boolean;
}
export declare class PlayerControl extends Component {
    name: "Player";
    classname: "PlayerControl";
    playerId: uint8;
    constructor(client: AmongusClient, netid: number, datalen?: number, data?: Buffer);
    OnSpawn(datalen: number, data: Buffer): PlayerControlOnSpawn;
    OnDeserialize(datalen: number, data: Buffer): void;
    Serialize(isNew?: boolean): Buffer;
    murderPlayer(netid: number): Promise<void>;
    setColour(colour: ColourID): Promise<void>;
    setColor(color: ColourID): Promise<void>;
    setName(name: string): Promise<void>;
    setHat(hat: HatID): Promise<void>;
    setSkin(skin: SkinID): Promise<void>;
    setPet(pet: PetID): Promise<void>;
    chat(text: string): Promise<void>;
}
export {};
