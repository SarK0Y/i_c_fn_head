"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.lang_proto = void 0;
exports.set_client = set_client;
exports.get_client = get_client;
exports.srv_definitions = srv_definitions;
exports.send_lang = send_lang;
exports.watch_active_lang = watch_active_lang;
const vscode = __importStar(require("vscode"));
const node_1 = require("vscode-languageclient/node");
const fs_stuff_1 = require("./fs_stuff");
const basic_funx_1 = require("./basic_funx");
const faav_1 = require("./faav");
var lang_proto;
(function (lang_proto) {
    lang_proto.set_lang = new node_1.NotificationType('i_c_fn_head/setLanguage');
    lang_proto.definitions = new node_1.RequestType('i_c_fn_head/definitions');
})(lang_proto || (exports.lang_proto = lang_proto = {}));
let _client = undefined;
function set_client(client) {
    _client = client;
}
function get_client() {
    return _client;
}
async function srv_definitions(uri, srcUri, word) {
    if (word == "") {
        return [];
    }
    if (_client == undefined) {
        await (0, basic_funx_1.prnt)("srv_definitions: no lsp client", faav_1.rank_msg.err);
        return [];
    }
    try {
        return await _client.sendRequest(lang_proto.definitions, { uri: uri, srcUri: srcUri, word: word });
    }
    catch (err) {
        await (0, basic_funx_1.prnt)("srv_definitions: " + String(err), faav_1.rank_msg.err);
        return [];
    }
}
async function send_lang(client, editor) {
    const doc = editor?.document;
    if (doc == undefined || doc.uri.scheme != "file") {
        return;
    }
    const lang = doc.languageId;
    if (lang == "") {
        return;
    }
    const file = await (0, fs_stuff_1.KeywordsFileOf)(lang);
    await (0, basic_funx_1.prnt)("send_lang: " + lang + " -> " + file, faav_1.rank_msg.dbg);
    await client.sendNotification(lang_proto.set_lang, { lang: lang, file: file });
}
function watch_active_lang(client) {
    send_lang(client, vscode.window.activeTextEditor);
    return vscode.window.onDidChangeActiveTextEditor(editor => {
        send_lang(client, editor);
    });
}
//# sourceMappingURL=lsp_lang.js.map