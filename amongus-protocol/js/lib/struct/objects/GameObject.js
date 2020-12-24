import { EventEmitter } from "events";
import { AmongusClient } from "../../Client.js";
export class GameObject extends EventEmitter {
    constructor(client, parent) {
        super();
        this.client = client;
        this.parentid = parent.id;
        this.children = [];
        this.components = [];
    }
    awaitChild(filter = () => true) {
        const _filter = typeof filter === "number" ? (object => object.spawnid === filter) : filter;
        return new Promise(resolve => {
            const child = this.children.find(_filter);
            if (child) {
                resolve(child);
            }
            this.on("spawn", function onObject(object) {
                if (_filter(object)) {
                    this.off("spawn", onObject);
                    resolve(object);
                }
            });
        });
    }
    getComponentsByClassName(classname) {
        const components = [];
        for (let i = 0; i < this.components.length; i++) {
            const component = this.components[i];
            if (component.classname === classname) {
                components.push(component);
            }
        }
        return components.length ? components : null;
    }
    findChild(filter) {
        const child = this.children.find(filter);
        if (child) {
            return child;
        }
        return null;
    }
    isChild(child) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] === child) {
                return true;
            }
        }
        return false;
    }
    removeChild(child) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] === child) {
                this.children.splice(i, 1);
                this.children[i].parent = null;
                break;
            }
        }
    }
    addChild(object) {
        if (!this.isChild(object)) {
            this.children.push(object);
            object.parent = this;
        }
    }
    setParent(parent) {
        if (this.parent instanceof AmongusClient)
            throw new Error("Could not set parent, object is global.");
        if (this.parent) {
            this.parent.removeChild(this);
        }
        parent.addChild(this);
    }
}
