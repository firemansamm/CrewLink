var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from "./Component.js";
import { BufferReader } from "../../util/BufferReader.js";
import { BufferWriter } from "../../util/BufferWriter.js";
import { LerpValue, UnlerpValue } from "../../util/Lerp.js";
import { DataID, MessageID, PacketID, PayloadID, RPCID } from "../../../index.js";
export class CustomNetworkTransform extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "Player";
        this.classname = "CustomNetworkTransform";
        this.sequence = null;
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    SidGreater(newSid) {
        if (this.sequence === null) {
            return true;
        }
        const threshold = this.sequence + 0x7FFF;
        const wrapped = threshold > 0xFFFF ? threshold - 0xFFFF : threshold;
        if (wrapped > this.sequence) {
            return newSid > this.sequence && newSid <= wrapped;
        }
        return newSid > this.sequence || newSid <= wrapped;
    }
    OnSpawn(datalen, data) {
        return this.OnDeserialize(datalen, data);
    }
    OnDeserialize(datalen, data) {
        const reader = new BufferReader(data);
        const sequence = reader.uint16LE();
        if (!this.SidGreater(sequence)) {
            return;
        }
        this.sequence = sequence;
        this.position = {
            x: LerpValue(reader.uint16LE() / 65535, -40, 40),
            y: LerpValue(reader.uint16LE() / 65535, -40, 40)
        };
        this.velocity = {
            x: LerpValue(reader.uint16LE() / 65535, -40, 40),
            y: LerpValue(reader.uint16LE() / 65535, -40, 40)
        };
        this.emit("move", this);
    }
    Serialize() {
        const writer = new BufferWriter;
        writer.uint16LE(this.sequence);
        writer.uint16LE(UnlerpValue(this.position.x, -40, 40) * 65535);
        writer.uint16LE(UnlerpValue(this.position.y, -40, 40) * 65535);
        writer.uint16LE(UnlerpValue(this.velocity.x, -40, 40) * 65535);
        writer.uint16LE(UnlerpValue(this.velocity.y, -40, 40) * 65535);
        return writer.buffer;
    }
    move(position, velocity) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = new BufferWriter;
            this.sequence++;
            if (this.sequence > 0xFFFF) {
                this.sequence -= 0x10000;
            }
            data.uint16LE(this.sequence);
            data.uint16LE(UnlerpValue(position.x, -40, 40) * 65535);
            data.uint16LE(UnlerpValue(position.y, -40, 40) * 65535);
            data.uint16LE(UnlerpValue(velocity.x, -40, 40) * 65535);
            data.uint16LE(UnlerpValue(velocity.x, -40, 40) * 65535);
            yield this.client.send({
                op: PacketID.Unreliable,
                payloads: [
                    {
                        payloadid: PayloadID.GameData,
                        code: this.client.game.code,
                        parts: [
                            {
                                type: MessageID.Data,
                                datatype: DataID.Movement,
                                netid: this.netid,
                                datalen: data.size,
                                data: data.buffer
                            }
                        ]
                    }
                ]
            });
        });
    }
    snapTo(position) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.send({
                op: PacketID.Reliable,
                payloads: [
                    {
                        payloadid: PayloadID.GameData,
                        code: this.client.game.code,
                        parts: [
                            {
                                type: MessageID.RPC,
                                handlerid: this.netid,
                                rpcid: RPCID.SnapTo,
                                x: position.x,
                                y: position.y
                            }
                        ]
                    }
                ]
            });
        });
    }
}
