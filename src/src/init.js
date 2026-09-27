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
exports.init = init;
exports.msg_opt = msg_opt;
exports.regDefProvider = regDefProvider;
exports.run_tsts7 = run_tsts7;
const vscode = __importStar(require("vscode"));
const faav_1 = require("./faav");
const goto_impl_1 = require("./goto_impl");
const colorful_1 = require("./colorful");
const show_doc_symbs_1 = require("./show_doc_symbs");
const basic_funx_1 = require("./basic_funx");
const fs_stuff_1 = require("./fs_stuff");
const Config_1 = require("./Config");
async function init(context) {
    // if (!i_c_fn_head_opts.been_set) { return; }
    //   try {
    await (0, Config_1.conf)(context);
    //await custom_lsp(context);
    await run_tsts7();
    const uri = await (0, fs_stuff_1.uri_to_file_of_opts)();
    const doc = await vscode.workspace.openTextDocument(uri[0]);
    txt._0 = doc.getText();
    set_lang("D", context);
    set_lang("Rust", context);
    set_lang("C", context);
    set_lang("CPP", context);
    set_lang("Java", context);
    faav_1.i_c_fn_head_opts.been_set = true;
    faav_1.i_c_fn_head_opts.path_to_conf = uri[0].fsPath;
    //vscode.window.showInformationMessage(msg);
    //  vscode.window.showInformationMessage(txt._0);
    // }
    //  catch (err) {
    //    await prnt("Sorry, Dear Dev.. it was failed to init i_c_fn_head (" + String(err) + " )", rank_msg.err);
    //  return;
    // }
    regDefProvider(context);
    (0, colorful_1.activate0)(context);
}
function run_opt(key) {
    return new RegExp(`\\/\\/\\s*run\\s+${key}\\s*\\/\\/`);
}
function msg_opt(key) {
    return new RegExp(`\\/\\/\\s*msg\\.${key}\\s*\\/\\/`);
}
function set_lang(name, context) {
    //vscode.window.showInformationMessage(txt._0);
    if (run_opt(name).test(txt._0) && name == "D") {
        faav_1.i_c_fn_head_opts.provide_lang_D = true;
        context?.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'D' }, new show_doc_symbs_1.ShowDocumentSymbols()));
    }
    if (run_opt(name).test(txt._0) && name == "Java") {
        faav_1.i_c_fn_head_opts.provide_lang_Java = true;
        context?.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'Java' }, new show_doc_symbs_1.ShowDocumentSymbols()));
    }
    if (run_opt(name).test(txt._0) && name == "CPP") {
        faav_1.i_c_fn_head_opts.provide_lang_CPP = true;
        context?.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'cpp' }, new show_doc_symbs_1.ShowDocumentSymbols()));
    }
    if (run_opt(name).test(txt._0) && name == "C") {
        faav_1.i_c_fn_head_opts.provide_lang_C = true;
        context?.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'c' }, new show_doc_symbs_1.ShowDocumentSymbols()));
    }
    if (run_opt(name).test(txt._0) && name == "Rust") {
        faav_1.i_c_fn_head_opts.provide_lang_Rust = true;
        context?.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'rust' }, new show_doc_symbs_1.ShowDocumentSymbols()));
    }
}
class txt {
    static _0 = "";
}
function regDefProvider(context) {
    const selector = mkDocSel();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(selector, new goto_impl_1.langDefinitionProvider()));
}
function mkDocSel() {
    let sel = [];
    let sel_strn = "";
    if (faav_1.i_c_fn_head_opts.provide_lang_C) {
        sel.push({ scheme: 'file', language: 'c' });
    }
    if (faav_1.i_c_fn_head_opts.provide_lang_Rust) {
        sel.push({ scheme: 'file', language: 'rust' });
    }
    if (faav_1.i_c_fn_head_opts.provide_lang_CPP) {
        sel.push({ scheme: 'file', language: 'cpp' });
    }
    if (faav_1.i_c_fn_head_opts.provide_lang_D) {
        sel.push({ scheme: 'file', language: 'D' });
    }
    return sel;
}
async function run_tsts7() {
    try {
        const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        let tst = /\/\/tests\/\//g;
        if (tst.test(txt)) {
            await tests();
        }
    }
    catch (err) {
        await (0, basic_funx_1.prnt)("run_tsts7: " + String(err), faav_1.rank_msg.err);
    }
}
async function tests() {
    await (0, basic_funx_1.prnt)("tst err msg", faav_1.rank_msg.err);
    await (0, basic_funx_1.prnt)("tst warn msg", faav_1.rank_msg.warn);
    await (0, basic_funx_1.prnt)("tst dbg msg", faav_1.rank_msg.dbg);
    await (0, basic_funx_1.prnt)("tst info msg", faav_1.rank_msg.info);
}
//# sourceMappingURL=init.js.map