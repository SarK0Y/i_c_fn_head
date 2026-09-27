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
exports.definitions = definitions;
const vscode = __importStar(require("vscode"));
const faav_1 = require("./faav");
const basic_funx_1 = require("./basic_funx");
const fs_stuff_1 = require("./fs_stuff");
const lsp_lang_1 = require("./lsp_lang");
const word_rgx = /[\w$@_]+/;
function to_location(l) {
    try {
        const start = new vscode.Position(l.range.start.line, l.range.start.character);
        const end = new vscode.Position(l.range.end.line, l.range.end.character);
        return new vscode.Location(vscode.Uri.parse(l.uri), new vscode.Range(start, end));
    }
    catch (err) {
        (0, basic_funx_1.prnt)("to_location: " + String(err), faav_1.rank_msg.err);
        return null;
    }
}
// F12: the jar resolves the //rgx:// commands of the opts file and searches
// the workspace, so nothing is searched here and there is no local fallback
async function definitions(doc, position, token) {
    const ret = [];
    const wordRange = doc.getWordRangeAtPosition(position, word_rgx);
    if (wordRange == undefined) {
        return ret;
    }
    const word = doc.getText(wordRange);
    if (word == "") {
        return ret;
    }
    const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
    if (file_of_opts.length == 0) {
        await (0, basic_funx_1.prnt)("definitions: no i_c_fn_head.opts found", faav_1.rank_msg.err);
        return ret;
    }
    await (0, basic_funx_1.prnt)("definitions: " + word + " -> " + file_of_opts[0].fsPath, faav_1.rank_msg.dbg);
    const locs = await (0, lsp_lang_1.srv_definitions)(file_of_opts[0].toString(), doc.uri.toString(), word);
    for (let l of locs) {
        if (token?.isCancellationRequested) {
            break;
        }
        const loc = to_location(l);
        if (loc != null) {
            ret.push(loc);
        }
    }
    await (0, basic_funx_1.prnt)("definitions: " + word + " -> " + ret.length + " locations", faav_1.rank_msg.dbg);
    return ret;
}
//# sourceMappingURL=fancy_f12.js.map