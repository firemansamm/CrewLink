"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyBehaviour = void 0;
var Component_js_1 = require("./Component.js");
var LobbyBehaviour = /** @class */ (function (_super) {
    __extends(LobbyBehaviour, _super);
    function LobbyBehaviour(client, netid, datalen, data) {
        var _this = _super.call(this, client, netid) || this;
        if (typeof datalen !== "undefined" && typeof data !== "undefined") {
            _this.OnSpawn(datalen, data);
        }
        return _this;
    }
    LobbyBehaviour.prototype.OnSpawn = function (datalen, data) {
    };
    LobbyBehaviour.prototype.OnDeserialize = function (datalen, data) {
    };
    LobbyBehaviour.prototype.Serialize = function () {
        return Buffer.alloc(0x00);
    };
    return LobbyBehaviour;
}(Component_js_1.Component));
exports.LobbyBehaviour = LobbyBehaviour;
