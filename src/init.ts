import * as vscode from 'vscode';
import { i_c_fn_head_opts, langsName, rank_msg } from './faav';
import { cmd_rgx } from './basic_funx';
import { langDefinitionProvider } from './goto_impl';
import { activate0 as colors } from './colorful';
import { ShowDocumentSymbols } from './show_doc_symbs'
import { getCMD, prnt } from './basic_funx';
export async function uri_to_file_of_opts(): Promise <vscode.Uri[]> {
    return vscode.workspace.findFiles(
        '**/i_c_fn_head.opts',
        "", /* exclude none path */
        1 /* only one result */
    );
}
export async function init(context: & vscode.ExtensionContext) {
   // if (!i_c_fn_head_opts.been_set) { return; }
    try {
        await run_tsts7();
        const uri = await uri_to_file_of_opts();
        const doc = await vscode.workspace.openTextDocument(uri[0]);
        txt._0 = doc.getText();
        set_lang("D", context);
        set_lang("Rust", context);
        set_lang("C", context);
        set_lang("CPP", context);
        i_c_fn_head_opts.been_set = true;
        i_c_fn_head_opts.path_to_conf = uri[0].fsPath;
        
        //vscode.window.showInformationMessage(msg);
      //  vscode.window.showInformationMessage(txt._0);
    }
    catch (err) {
        await prnt("Sorry, Dear Dev.. it was failed to init i_c_fn_head (" + String(err) + " )", rank_msg.err);
        return;
     }
    regDefProvider(context);
    colors(context);
}
function run_opt(key: string): RegExp {
    return new RegExp(`\\/\\/\\s*run\\s+${key}\\s*\\/\\/`);
}
export function msg_opt(key: string): RegExp {
    return new RegExp(`\\/\\/\\s*msg\\.${key}\\s*\\/\\/`);
}
function set_lang(name: string, context?: vscode.ExtensionContext) {
    //vscode.window.showInformationMessage(txt._0);
    if (run_opt(name).test(txt._0) && name == "D") {
        i_c_fn_head_opts.provide_lang_D = true;
        context?.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider({ language: 'D' }, new ShowDocumentSymbols())
        );
    }
    if (run_opt(name).test(txt._0) && name == "CPP") {
        i_c_fn_head_opts.provide_lang_CPP = true;
        context?.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider({ language: 'cpp' }, new ShowDocumentSymbols())
        );
    }
    if (run_opt(name).test(txt._0) && name == "C") {
        i_c_fn_head_opts.provide_lang_C = true;
        context?.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider({ language: 'c' }, new ShowDocumentSymbols())
        );
    }
    if (run_opt(name).test(txt._0) && name == "Rust") {
        i_c_fn_head_opts.provide_lang_Rust = true;
        context?.subscriptions.push(
            vscode.languages.registerDocumentSymbolProvider({ language: 'rust' }, new ShowDocumentSymbols())
        );
    }
}
class txt {
    static _0: string = "";
}
export function regDefProvider(context: & vscode.ExtensionContext) {
     const selector: vscode.DocumentSelector = mkDocSel ();
      context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(selector, new langDefinitionProvider())
      );
}
function mkDocSel(): vscode.DocumentSelector {
    let sel = [] as (vscode.DocumentFilter | string)[];
    let sel_strn: string = "";
    if (i_c_fn_head_opts.provide_lang_C) { sel.push({ scheme: 'file', language: 'c' }); }
    if (i_c_fn_head_opts.provide_lang_Rust) { sel.push({ scheme: 'file', language: 'rust' }); }
    if (i_c_fn_head_opts.provide_lang_CPP) { sel.push({ scheme: 'file', language: 'cpp' }); }
    if (i_c_fn_head_opts.provide_lang_D) { sel.push({ scheme: 'file', language: 'D' }); }
    return sel
}
export async function run_tsts7(): Promise <void> {
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        let tst = /\/\/tests\/\//g;
        if (tst.test(txt)) { 
            await tests();
        }
    } catch (err) {
        await prnt("run_tsts7: " + String(err), rank_msg.err);
    }
}
async function tests() {
    await prnt("tst err msg", rank_msg.err);
    await prnt("tst warn msg", rank_msg.warn);
    await prnt("tst dbg msg", rank_msg.dbg);
    await prnt("tst info msg", rank_msg.info);
}
export async function include_subdirs(): Promise<void> {
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        let tst: string = "//\s*" + cmd_rgx.open_rgx + "\s*" + "([a-zA-Z/_\.0-9\-]+)" + "\s*" + cmd_rgx + "//";
        let rgx = RegExp(tst, "g");
        let collect_includes = txt.matchAll(rgx);
        let ret: string [] = []
    } catch (err) {
        await prnt("run_tsts7: " + String(err), rank_msg.err);
    }
}