var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AmongusClient, HatID, MasterServers, DebugOptions } from "../index.js";
const sleep = ms => new Promise(r => setTimeout(r, ms));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = new AmongusClient({
        debug: DebugOptions.Everything
    });
    const servers = MasterServers.EU[0];
    yield client.connect(servers[0], servers[1], "weakeyes");
    const game = yield client.join(process.argv[2]);
    yield game.awaitSpawns();
    game.GameData.GameData.on("playerData", player => {
        console.log(player);
    });
    yield game.me.setName("strongeyes");
    yield game.me.setColour(Math.floor(Math.random() * 13));
    yield game.me.setHat(HatID.Plague);
    game.on("chat", (client, text) => {
        console.log(text);
    });
    game.on("finish", reason => {
        console.log(reason);
    });
}))();
