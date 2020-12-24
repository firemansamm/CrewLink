import { Component } from "./Component.js";
import { BufferReader } from "../../util/BufferReader.js";
import { PlayerVoteAreaFlags } from "../../interfaces/Packets.js";
export class MeetingHud extends Component {
    constructor(client, netid, datalen, data) {
        super(client, netid);
        this.name = "MeetingHub";
        this.classname = "MeetingHud";
        this.states = new Map;
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            this.OnSpawn(datalen, data);
        }
    }
    OnSpawn(datalen, data) {
        const reader = new BufferReader(data);
        for (let playerId = 0; playerId < datalen; playerId++) {
            const flags = reader.byte();
            const state = {
                flags,
                playerId,
                votedFor: flags & PlayerVoteAreaFlags.VotedFor,
                reported: (flags & PlayerVoteAreaFlags.DidReport) !== 0,
                voted: (flags & PlayerVoteAreaFlags.DidVote) !== 0,
                dead: (flags & PlayerVoteAreaFlags.IsDead) !== 0
            };
            state.votedFor = state.votedFor < 10 ? state.votedFor : -1;
            this.states.set(playerId, state);
        }
        this.emit("update", this.states);
    }
    OnDeserialize(datalen, data) {
        const reader = new BufferReader(data);
        const updateMask = reader.packed();
        const updated = new Map();
        for (let playerId = 0; reader.offset < reader.size; playerId++) {
            const flags = reader.byte();
            if (((1 << playerId) & updateMask) !== 0) {
                const state = {
                    flags,
                    playerId,
                    votedFor: (flags & PlayerVoteAreaFlags.VotedFor) - 1,
                    reported: (flags & PlayerVoteAreaFlags.DidReport) !== 0,
                    voted: (flags & PlayerVoteAreaFlags.DidVote) !== 0,
                    dead: (flags & PlayerVoteAreaFlags.IsDead) !== 0
                };
                state.votedFor = state.votedFor < 10 ? state.votedFor : -1;
                const old_state = this.states.get(playerId);
                if (old_state && state.voted && !old_state.voted) {
                    this.client.game.emit("vote", this.client.game.getClientByPlayerID(state.playerId), this.client.game.getClientByPlayerID(state.votedFor));
                }
                this.states.set(playerId, state);
                updated.set(playerId, state);
            }
        }
        this.emit("update", updated);
        return updateMask;
    }
}
