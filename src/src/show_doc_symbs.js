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
exports.ShowDocumentSymbols = void 0;
exports.manage_output = manage_output;
const vscode = __importStar(require("vscode"));
const fn_body_n_head_1 = require("./fn_body_n_head");
class ShowDocumentSymbols {
    provideDocumentSymbols(document, token) {
        let symbols = [];
        let text0 = document.getText();
        const text = text0.split("\n");
        // Regular expression patterns for different symbols
        const functionPattern = [
            /(^(\s*if))/g,
        ];
        const classPattern = /class\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
        const variablePattern = /const\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|let\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|var\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
        let wrong_ending = /;[\s]*}?$/;
        const func_ret = /^return\s/;
        const while_op = /[\s]*while[\s]*\(/;
        const for_op = /\s*for[\s]*\(?/;
        const switch_op = /[\s]*switch[\s]*\(?/;
        const if_op = /^[\s]*if[\s]*\(/;
        const scope_op_in_D = /^scope\s*\(/;
        const bad_symbs = /[=+\-]/;
        // Extract functions
        let match = null;
        //console.log("start");
        //console.log(text);
        let yes_D = vscode.window.activeTextEditor?.document.languageId.toLowerCase() === "d";
        let functionName = "";
        let _1st = true;
        let line = 0;
        let pos = new vscode.Range(0, 0, 0, 100);
        let point = new vscode.Position(0, 0);
        let set_rng;
        let default_range = new vscode.Range(0, 0, 0, 100);
        /*	while ((match = select_lang_n_tst_fn_head (text0) ) !== null) {
                const fnName = match[1];
                const position = document.positionAt(match.index);
                symbols.push(new vscode.SymbolInformation(fnName, vscode.SymbolKind.Function, '', new vscode.Location(document.uri, position)));
            }*/
        //dont_clobbe_line_w_curly_bracket(text0, document.uri);
        //	if (manage_output(text0, document.uri, symbols) != _manage_output.Rust) { return symbols; }
        manage_output(text0, document.uri, symbols);
        return symbols;
    }
}
exports.ShowDocumentSymbols = ShowDocumentSymbols;
var _manage_output;
(function (_manage_output) {
    _manage_output[_manage_output["C"] = 0] = "C";
    _manage_output[_manage_output["D"] = 1] = "D";
    _manage_output[_manage_output["Rust"] = 2] = "Rust";
    _manage_output[_manage_output["CPP"] = 3] = "CPP";
})(_manage_output || (_manage_output = {}));
function manage_output(doc, uri, symbols) {
    const langId = vscode.window.activeTextEditor?.document.uri.fsPath ?? "";
    let regex = /rs$|c$|cpp$|d$/g;
    let lang = regex.exec(langId)?.[0] ?? "";
    const msg = "Active lang: " + langId?.toString();
    //vscode.window.showInformationMessage(msg);
    switch (lang) {
        case "c": {
            (0, fn_body_n_head_1.c_fn_body)(doc, uri, symbols);
            return _manage_output.C;
        }
        case "cpp": {
            (0, fn_body_n_head_1.c_fn_body)(doc, uri, symbols);
            return _manage_output.CPP;
        }
        case "d": {
            (0, fn_body_n_head_1._c_fn_body)(doc, uri, symbols);
            return _manage_output.D;
        }
        case "rs": {
            (0, fn_body_n_head_1._rust_fn_body)(doc, uri, symbols);
            return _manage_output.Rust;
        } // { return rust_head() }
    }
    //	prnt(msg);
    return null;
}
//# sourceMappingURL=show_doc_symbs.js.map