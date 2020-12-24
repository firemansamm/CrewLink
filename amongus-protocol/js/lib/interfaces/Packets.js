export var PlayerDataFlags;
(function (PlayerDataFlags) {
    PlayerDataFlags[PlayerDataFlags["Disconnected"] = 1] = "Disconnected";
    PlayerDataFlags[PlayerDataFlags["IsImposter"] = 2] = "IsImposter";
    PlayerDataFlags[PlayerDataFlags["IsImpostor"] = 2] = "IsImpostor";
    PlayerDataFlags[PlayerDataFlags["IsDead"] = 4] = "IsDead";
})(PlayerDataFlags || (PlayerDataFlags = {}));
export var PlayerVoteAreaFlags;
(function (PlayerVoteAreaFlags) {
    PlayerVoteAreaFlags[PlayerVoteAreaFlags["VotedFor"] = 15] = "VotedFor";
    PlayerVoteAreaFlags[PlayerVoteAreaFlags["DidReport"] = 32] = "DidReport";
    PlayerVoteAreaFlags[PlayerVoteAreaFlags["DidVote"] = 64] = "DidVote";
    PlayerVoteAreaFlags[PlayerVoteAreaFlags["IsDead"] = 128] = "IsDead";
})(PlayerVoteAreaFlags || (PlayerVoteAreaFlags = {}));
export var GameListClientBoundTag;
(function (GameListClientBoundTag) {
    GameListClientBoundTag[GameListClientBoundTag["List"] = 0] = "List";
    GameListClientBoundTag[GameListClientBoundTag["Count"] = 1] = "Count";
})(GameListClientBoundTag || (GameListClientBoundTag = {}));
