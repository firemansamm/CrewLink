import patcher from '../patcher';
import { GameState, AmongUsState, Player } from '../common/AmongUsState';
import { MasterServers } from 'amongus-protocol/js';
import ProxyServer from './GameServer';


export default class GameReader {
	reply: (event: string, ...args: unknown[]) => void;

	menuUpdateTimer = 20;
	oldGameState = GameState.UNKNOWN;
	lastState: AmongUsState = {} as AmongUsState;
	gameServer: ProxyServer;

	gameCode = '??????';
	loop(): void {
		const gameState = this.gameServer.update();
		if (!gameState) {
			if (this.lastState.gameState != null) {
				this.reply('gameOpen', 1);
			}
			if (this.lastState != {} as AmongUsState) this.lastState = {} as AmongUsState;
			return;
		}
		let state = GameState.TASKS;
		// TODO: check if the game is a meeting?
		if (gameState.meeting) state = GameState.DISCUSSION;
		const players = gameState.players;

		// const impostors = players.filter(x => x.isImpostor).length, crewmates = gameState.players.length - impostors;
		const newState = {
			lobbyCode: this.gameCode,
			players,
			gameState: state,
			oldGameState: this.oldGameState,
			clientId: gameState.localclientid,
			hostId: gameState.hostid,
			isHost: gameState.ishost
		};
		const patch = patcher.diff(this.lastState, newState);
		if (patch) {
			try {
				this.reply('gameState', newState);
			} catch (e) {
				process.exit(0);
			}
		}

		if (this.lastState.gameState == null && gameState != null) {
			this.reply('gameOpen', 2);
		}
		
		// @ts-ignore there are no nulls here
		this.lastState = newState;
		this.oldGameState = state;
	}

	constructor(reply: (event: string, ...args: unknown[]) => void, code: string, region: string) {
		this.reply = reply;
		
		this.reply('gameOpen', 1);
		this.gameCode = code;

		let server: (string|number)[] = MasterServers.AS[0].slice();
		if (region == 'NA') server = MasterServers.NA[0].slice();
		else server = MasterServers.EU[0].slice();

		//@ts-ignore go away i know what i'm doing
		this.gameServer = new ProxyServer(this.gameCode, this.gameCode, server);
		this.gameServer.start();
	}
}

