var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AmongusClient, MasterServers } from "../index.js";
const usernames = ["cutizzard", "sidesea", "usesure", "trippabs", "noveldim", "borummall", "blowspoke", "mownye", "plainsite", "taskcoven", "pabsbadly", "learnquit", "railwitty", "musicdesk", "voteentry", "bowerhome", "agosquod", "momvast", "tntpomach", "warghire", "cawncrowl", "centrough", "disneyrod", "ledcup", "tailwhirl", "impedepie", "tixtwang", "trackskin", "tosswide", "tripcouch"];
for (let i = 0; i < 5; i++) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const client = new AmongusClient;
        const server = MasterServers.EU[0];
        yield client.connect(server[0], server[1], "weakeyes");
        const game = yield client.join(process.argv[2]);
        yield game.awaitSpawns();
        game.me.setName("Kaby");
        game.me.setColour(Math.floor(Math.random() * 13));
        game.me.setHat(Math.floor(Math.random() * 90));
        const foxnews = yield game.findPlayer("Fox News");
        foxnews.Player.CustomNetworkTransform.on("move", transform => {
            game.me.move(transform.position, transform.velocity);
        });
        game.on("start", () => {
            setTimeout(function () {
                for (let i = 0; i < game.me.tasks.length; i++)
                    game.me.completeTask(i);
            }, 7500);
        });
        game.on("meeting", () => {
            game.me.chat("I'm pretty sure that these are the imposters: " + game.imposters.map(imposter => imposter.PlayerData.name).join(", "));
            setTimeout(function () {
                game.me.vote(game.imposters[Math.floor(Math.random() * game.imposters.length)]);
            }, (game.options.discussionTime + 5) * 1000);
        });
    }))();
}
