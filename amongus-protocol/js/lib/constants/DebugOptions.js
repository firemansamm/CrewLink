export var DebugOptions;
(function (DebugOptions) {
    DebugOptions[DebugOptions["None"] = 0] = "None";
    DebugOptions[DebugOptions["Everything"] = 1] = "Everything";
    DebugOptions[DebugOptions["Acknowledgements"] = 2] = "Acknowledgements";
    DebugOptions[DebugOptions["PayloadOutbound"] = 4] = "PayloadOutbound";
    DebugOptions[DebugOptions["PayloadInbound"] = 8] = "PayloadInbound";
    DebugOptions[DebugOptions["SpecialOutbound"] = 16] = "SpecialOutbound";
    DebugOptions[DebugOptions["SpecialInbound"] = 32] = "SpecialInbound";
    DebugOptions[DebugOptions["PacketOutbound"] = 20] = "PacketOutbound";
    DebugOptions[DebugOptions["PacketInbound"] = 40] = "PacketInbound";
    DebugOptions[DebugOptions["AllPackets"] = 60] = "AllPackets";
    DebugOptions[DebugOptions["SystemData"] = 64] = "SystemData";
    DebugOptions[DebugOptions["Component"] = 128] = "Component";
    DebugOptions[DebugOptions["ObjectSpawn"] = 256] = "ObjectSpawn";
    DebugOptions[DebugOptions["ObjectDespawn"] = 512] = "ObjectDespawn";
    DebugOptions[DebugOptions["Object"] = 896] = "Object";
})(DebugOptions || (DebugOptions = {}));
