import { AmongusClient } from "../Client.js";
import { Player } from "./objects/Player.js";
import { ColourID, HatID, PetID, SkinID, SystemType, TaskID } from "../constants/Enums.js";
import { Vector2 } from "../interfaces/Types.js";
import { PlayerTaskState, SceneChangeLocation } from "../interfaces/Packets.js";
import { GameObject } from "./objects/GameObject.js";
export interface PlayerClient {
    on(event: "spawn", listener: (player: Player) => void): any;
    on(event: "taskComplete", listener: (task: PlayerTaskState) => void): any;
    on(event: "setTasks", listener: (tasks: TaskID[]) => void): any;
    on(event: "vote", listener: (suspect: PlayerClient) => void): any;
    on(event: "kicked", listener: (banned: boolean) => void): any;
    on(event: "murder", listener: (target: PlayerClient) => void): any;
    on(event: "murdered", listener: (murderer: PlayerClient) => void): any;
    on(event: "sceneChange", listener: (location: SceneChangeLocation) => void): any;
    on(event: "chat", listener: (text: string) => void): any;
}
export declare class PlayerClient extends GameObject {
    protected client: AmongusClient;
    clientid: number;
    children: Player[];
    removed: boolean;
    dead: boolean;
    is_ready: boolean;
    tasks: TaskID[];
    constructor(client: AmongusClient, clientid: number);
    awaitSpawn(): Promise<Player>;
    addChild(object: GameObject): void;
    get isImposter(): boolean;
    get isImpostor(): boolean;
    get Player(): Player;
    get PlayerData(): import("../interfaces/Packets.js").ParsedPlayerGameData;
    get name(): string;
    kick(ban?: boolean): Promise<void>;
    ban(): Promise<void>;
    murder(target: PlayerClient): Promise<void>;
    _setTasks(tasks: TaskID[]): void;
    setTasks(tasks: TaskID[]): Promise<void>;
    /**
     * @param task The index of the task as in PlayerClient.tasks.
     */
    completeTask(task: number): Promise<void>;
    vote(player: PlayerClient | "skip"): Promise<void>;
    voteKick(player: PlayerClient): Promise<void>;
    ready(): Promise<void>;
    startMeeting(bodyid: number | "emergency"): Promise<void>;
    sabotageSystem(system: SystemType): Promise<void>;
    setName(name: string): Promise<void>;
    setColour(colour: ColourID): Promise<void>;
    setColor(color: ColourID): Promise<void>;
    setHat(hat: HatID): Promise<void>;
    setSkin(skin: SkinID): Promise<void>;
    setPet(pet: PetID): Promise<void>;
    chat(text: string): Promise<void>;
    move(position: Vector2, velocity: Vector2): Promise<void>;
    snapTo(position: Vector2): Promise<void>;
}
