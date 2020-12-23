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
import { MessageID, PacketID, PayloadID, RPCID } from "../../../index.js";
import { BufferWriter } from "../../util/BufferWriter.js";
export class PlayerControl extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "Player";
        this.classname = "PlayerControl";
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
        const reader = new BufferReader(data);
        const isNew = reader.bool();
        this.playerId = reader.uint8();
        return {
            isNew
        };
    }
    OnDeserialize(datalen, data) {
        const reader = new BufferReader(data);
        this.playerId = reader.uint8();
    }
    Serialize(isNew = false) {
        const writer = new BufferWriter;
        writer.bool(isNew);
        writer.uint8(this.playerId);
        return writer.buffer;
    }
    murderPlayer(netid) {
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
                                rpcid: RPCID.MurderPlayer,
                                targetnetid: netid
                            }
                        ]
                    }
                ]
            });
        });
    }
    setColour(colour) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.client.game.hostid) {
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
                                    rpcid: RPCID.SetColour,
                                    colour
                                }
                            ]
                        }
                    ]
                });
            }
            else {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameDataTo,
                            recipient: this.client.game.hostid,
                            code: this.client.game.code,
                            parts: [
                                {
                                    type: MessageID.RPC,
                                    handlerid: this.netid,
                                    rpcid: RPCID.CheckColour,
                                    colour
                                }
                            ]
                        }
                    ]
                });
                yield this.client.awaitPayload(payload => payload.payloadid === PayloadID.GameData
                    && payload.parts.some(part => part.type === MessageID.RPC && part.rpcid === RPCID.SetColour));
            }
        });
    }
    setColor(color) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setColour(color);
        });
    }
    setName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client.clientid === this.client.game.hostid) {
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
                                    rpcid: RPCID.SetName,
                                    name
                                }
                            ]
                        }
                    ]
                });
            }
            else {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            payloadid: PayloadID.GameDataTo,
                            recipient: this.client.game.hostid,
                            code: this.client.game.code,
                            parts: [
                                {
                                    type: MessageID.RPC,
                                    handlerid: this.netid,
                                    rpcid: RPCID.CheckName,
                                    name
                                }
                            ]
                        }
                    ]
                });
                yield this.client.awaitPayload(payload => payload.payloadid === PayloadID.GameData
                    && payload.parts.some(part => part.type === MessageID.RPC && part.handlerid === this.netid && part.rpcid === RPCID.SetName));
            }
        });
    }
    setHat(hat) {
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
                                rpcid: RPCID.SetHat,
                                hat
                            }
                        ]
                    }
                ]
            });
        });
    }
    setSkin(skin) {
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
                                rpcid: RPCID.SetSkin,
                                skin: skin
                            }
                        ]
                    }
                ]
            });
        });
    }
    setPet(pet) {
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
                                rpcid: RPCID.SetPet,
                                pet: pet
                            }
                        ]
                    }
                ]
            });
        });
    }
    chat(text) {
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
                                rpcid: RPCID.SendChat,
                                text
                            }
                        ]
                    }
                ]
            });
        });
    }
}
