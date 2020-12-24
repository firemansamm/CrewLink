var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AmongusClient, MasterServers, ColourID, DebugOptions } from "../index.js";
import { GameData } from "../lib/struct/objects/GameData.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = new AmongusClient({
        debug: DebugOptions.Everything
    });
    const server = MasterServers.NA[0];
    yield client.connect("208.110.239.187", 22023, "weakeyes");
    const game = yield client.join(process.argv[2], {
        doSpawn: true
    });
    game.on("playerJoin", (client) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Joined", client.clientid);
    }));
    game.on("playerLeave", (client) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Left", client.clientid);
    }));
    game.on("startCount", (counter) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Game starting..", counter);
    }));
    game.on("start", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Game started!");
    }));
    game.on("setImposters", imposters => {
        console.log("The imposters are: ", imposters.map(client => client.PlayerData.name));
    });
    game.me.on("spawn", (player) => __awaiter(void 0, void 0, void 0, function* () {
        game.me.setColour(ColourID.Red);
        game.me.setName("strong eyes");
    }));
    game.on("spawn", object => {
        if (object instanceof GameData) {
            object.GameData.on("playerData", playerData => {
                console.log("playerData: " + playerData.name);
            });
        }
    });
}));
