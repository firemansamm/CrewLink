var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AmongusClient, MasterServers, DebugOptions } from "../index.js";
import { Int2Code } from "../lib/util/Codes.js";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = new AmongusClient({
        debug: DebugOptions.Everything
    });
    const server = MasterServers.NA[0];
    yield client.connect(server[0], server[1], "weakeyes");
    const game = yield client.host();
    yield client.join(game.code, {
        doSpawn: false
    });
    console.log(game);
    console.log(Int2Code(game.code));
}))();
