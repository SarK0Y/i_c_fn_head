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
exports.langDefinitionProvider = void 0;
const vscode = __importStar(require("vscode"));
const faav_1 = require("./faav");
const fancy_f12_1 = require("./fancy_f12");
const basic_funx_1 = require("./basic_funx");
const fs_stuff_1 = require("./fs_stuff");
class langDefinitionProvider {
    async provideDefinition(document, position, token) {
        const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        faav_1.restrict_search.exclude_paths = "**/(" + (await (0, basic_funx_1.getCMD)(null, txt, "exclude_path"))?.[0].source + ")/*";
        const wordRange = document.getWordRangeAtPosition(position, /[\w$@_]+/);
        //if (!wordRange) return [];
        let word = document.getText(wordRange);
        const extra_locations = word != undefined && word != "" ? await (0, fancy_f12_1.handleExtraCMDs)(word) : await (0, fancy_f12_1.handleExtraCMDs)();
        const results = [];
        await (0, basic_funx_1.prnt)(extra_locations.kind);
        if (extra_locations.kind == "extra_locations") {
            results.push(...extra_locations.v);
            return results;
        }
        let file_exts = (await (0, faav_1.langsName)()).file_exts;
        let file_ext = "**/*." + file_exts[0];
        /*let uris = await vscode.workspace.findFiles(
          file_ext,
          restrict_search.exclude_paths,
          restrict_search.max_num_of_res); */
        let uris = await (0, fancy_f12_1._a_get_files_in_workspace)();
        for (const uri of uris) {
            if (token.isCancellationRequested)
                break;
            try {
                const doc = await vscode.workspace.openTextDocument(uri);
                const text = doc.getText();
                let idx = text.indexOf(word);
                //  vscode.window.showInformationMessage(idx.toString());
                while (idx !== -1) {
                    if (token.isCancellationRequested)
                        break;
                    // crude heuristic: treat occurrences followed by '(' or ':' or '=' as possible definitions
                    const after = text.substr(idx + word.length, 3);
                    //  const isDef = /[\s\(=:\{]/.test(after);
                    //if (isDef) {
                    const start = doc.positionAt(idx);
                    const end = doc.positionAt(idx + word.length);
                    results.push(new vscode.Location(uri, new vscode.Range(start, end)));
                    //}
                    idx = text.indexOf(word, idx + 1);
                }
            }
            catch {
                // ignore files that can't be opened
            }
        }
        return results;
    }
}
exports.langDefinitionProvider = langDefinitionProvider;
//# sourceMappingURL=goto_impl.js.map