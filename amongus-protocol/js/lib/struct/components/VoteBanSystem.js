import { Component } from "./Component.js";
import { BufferReader } from "../../util/BufferReader.js";
import { BufferWriter } from "../../util/BufferWriter.js";
export class VoteBanSystem extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "GameData";
        this.classname = "VoteBanSystem";
        this.votes = new Map;
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
        return this.OnDeserialize(datalen, data);
    }
    OnDeserialize(datalen, data) {
        const reader = new BufferReader(data);
        const num_voted = reader.byte();
        for (let i = 0; i < num_voted; i++) {
            const voted = reader.int32LE();
            if (voted) {
                if (!this.votes.get(voted)) {
                    this.votes.set(voted, []);
                }
                for (let i = 0; i < 3; i++) {
                    this.votes.get(voted).push(reader.packed());
                }
            }
            else {
                break;
            }
        }
        this.emit("update", this.votes);
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.packed(this.votes.size);
        for (let [clientid, votes] of this.votes) {
            writer.int32BE(clientid);
            for (let i = 0; i < 3; i++) {
                writer.packed(votes[i]);
            }
        }
        return writer.buffer;
    }
}
