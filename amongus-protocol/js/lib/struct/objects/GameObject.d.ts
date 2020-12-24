/// <reference types="node" />
import { EventEmitter } from "events";
import { AmongusClient } from "../../Client.js";
import { SpawnID } from "../../constants/Enums.js";
import { Component } from "../components/Component.js";
export interface GameObject {
    on(event: "spawn", listener: (object: GameObject) => void): any;
}
export declare class GameObject extends EventEmitter {
    protected client: AmongusClient;
    id: number;
    spawnid: SpawnID;
    parentid: number;
    children: GameObject[];
    parent: AmongusClient | GameObject;
    components: Component[];
    constructor(client: AmongusClient, parent: AmongusClient | GameObject);
    awaitChild<T extends GameObject>(filter?: SpawnID | ((object: T) => boolean)): Promise<T>;
    getComponentsByClassName(classname: string): Component[];
    findChild(filter: (object: GameObject) => boolean): GameObject;
    isChild(child: GameObject): boolean;
    removeChild(child: GameObject): void;
    addChild(object: GameObject): void;
    setParent(parent: GameObject): void;
}
