var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Player } from "./objects/Player.js";
import { MessageID, PacketID, PayloadID, RPCID, SystemType } from "../constants/Enums.js";
import { GameObject } from "./objects/GameObject.js";
import { MeetingHub } from "./objects/MeetingHub.js";
export class PlayerClient extends GameObject {
    constructor(client, clientid) {
        super(client, client);
        this.client = client;
        this.clientid = clientid;
        this.removed = false;
        this.dead = false;
        this.is_ready = false;
        this.tasks = [];
        this.id = clientid;
    }
    awaitSpawn() {
        return new Promise(resolve => {
            if (this.Player) {
                return resolve(this.Player);
            }
            this.once("spawn", player => {
                resolve(player);
            });
        });
    }
    addChild(object) {
        super.addChild(object);
        this.client.game.registerComponents(object);
        if (object instanceof Player)
            this.emit("spawn", object);
    }
    get isImposter() {
        return !!this.client.game.imposters.find(imposter => imposter.Player.PlayerControl.playerId === this.Player.PlayerControl.playerId);
    }
    get isImpostor() {
        return !!this.client.game.imposters.find(imposter => imposter.Player.PlayerControl.playerId === this.Player.PlayerControl.playerId);
    }
    get Player() {
        return this.children[0];
    }
    get PlayerData() {
        return this.client.game.GameData.GameData.players.get(this.Player.PlayerControl.playerId);
    }
    get name() {
        var _a;
        return (_a = this.PlayerData) === null || _a === void 0 ? void 0 : _a.name;
    }
    kick(ban = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.removed) {
                yield this.client.send({
                    op: PacketID.Reliable,
                    payloads: [
                        {
                            bound: "server",
                            payloadid: PayloadID.KickPlayer,
                            clientid: this.clientid,
                            banned: ban
                        }
                    ]
                });
            }
        });
    }
    ban() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.kick(true);
        });
    }
    murder(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                this.Player.PlayerControl.murderPlayer(target.Player.PlayerControl.netid);
            }
        });
    }
    _setTasks(tasks) {
        this.tasks = tasks;
        this.emit("setTasks", this.tasks);
    }
    setTasks(tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            this._setTasks(tasks);
            yield this.client.send({
                op: PacketID.Reliable,
                payloads: [
                    {
                        payloadid: PayloadID.GameData,
                        code: this.client.game.code,
                        parts: [
                            {
                                type: MessageID.RPC,
                                handlerid: this.client.game.GameData.GameData.netid,
                                rpcid: RPCID.SetTasks,
                                playerid: this.Player.PlayerControl.playerId,
                                tasks
                            }
                        ]
                    }
                ]
            });
        });
    }
    /**
     * @param task The index of the task as in PlayerClient.tasks.
     */
    completeTask(task) {
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
                                rpcid: RPCID.CompleteTask,
                                handlerid: this.Player.PlayerControl.netid,
                                taskid: task
                            }
                        ]
                    }
                ]
            });
        });
    }
    vote(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                const meetinghub = this.client.game.findChild(object => object instanceof MeetingHub);
                if (meetinghub) {
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
                                        rpcid: RPCID.CastVote,
                                        handlerid: meetinghub.MeetingHud.netid,
                                        voterid: this.Player.PlayerControl.playerId,
                                        suspectid: player === "skip" ? 0xFF : player.Player.PlayerControl.playerId
                                    }
                                ]
                            }
                        ]
                    });
                }
            }
        });
    }
    voteKick(player) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                const gamedata = this.client.game.GameData;
                if (gamedata) {
                    yield this.client.send({
                        op: PacketID.Reliable,
                        payloads: [
                            {
                                payloadid: PayloadID.GameData,
                                code: this.client.game.code,
                                parts: [
                                    {
                                        type: MessageID.RPC,
                                        rpcid: RPCID.AddVote,
                                        handlerid: gamedata.VoteBanSystem.netid,
                                        targetid: player.Player.PlayerControl.playerId
                                    }
                                ]
                            }
                        ]
                    });
                }
            }
        });
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.send({
                op: PacketID.Reliable,
                payloads: [
                    {
                        payloadid: PayloadID.GameData,
                        code: this.client.game.code,
                        parts: [
                            {
                                type: MessageID.Ready,
                                clientid: this.clientid
                            }
                        ]
                    }
                ]
            });
        });
    }
    startMeeting(bodyid) {
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
                                rpcid: RPCID.ReportDeadBody,
                                handlerid: this.Player.PlayerControl.netid,
                                bodyid: bodyid === "emergency" ? 0xFF : bodyid
                            }
                        ]
                    }
                ]
            });
        });
    }
    sabotageSystem(system) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.send({
                op: PacketID.Reliable,
                payloads: [
                    {
                        payloadid: PayloadID.GameDataTo,
                        code: this.client.game.code,
                        recipient: this.client.game.hostid,
                        parts: [
                            {
                                type: MessageID.RPC,
                                rpcid: RPCID.RepairSystem,
                                handlerid: this.Player.PlayerControl.netid,
                                systemtype: SystemType.Sabotage,
                                amount: system
                            }
                        ]
                    }
                ]
            });
        });
    }
    setName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setName(name);
            }
        });
    }
    setColour(colour) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setColour(colour);
            }
        });
    }
    setColor(color) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setColor(color);
            }
        });
    }
    setHat(hat) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setHat(hat);
            }
        });
    }
    setSkin(skin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setSkin(skin);
            }
        });
    }
    setPet(pet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.setPet(pet);
            }
        });
    }
    chat(text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.PlayerControl.chat(text);
            }
        });
    }
    move(position, velocity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.CustomNetworkTransform.move(position, velocity);
            }
        });
    }
    snapTo(position) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Player && !this.removed) {
                yield this.Player.CustomNetworkTransform.snapTo(position);
            }
        });
    }
}
