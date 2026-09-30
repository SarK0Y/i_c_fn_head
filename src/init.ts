import * as vscode from 'vscode';
import { i_c_fn_head_opts, enable_lang, flag_of_lang, ids_of_lang, lang_sel, langsName, rank_msg, doc_sel } from './faav';
import { cmd_rgx } from './basic_funx';
import { langDefinitionProvider } from './goto_impl';
import { activate0 as colors } from './colorful';
import { ShowDocumentSymbols } from './show_doc_symbs'
import { getCMD, prnt } from './basic_funx';
import { uri_to_file_of_opts } from './fs_stuff';
import { conf } from './Config';
import { custom_lsp } from './custom_lsp_cmd';
import { sync_bkp } from './basic_funx';

export async function init(context: vscode.ExtensionContext) {
   // if (!i_c_fn_head_opts.been_set) { return; }
  //   try {
        await run_tsts7();
        const uri = await uri_to_file_of_opts();
        const doc = await vscode.workspace.openTextDocument(uri[0]);
        txt._0 = doc.getText();
        // flags first: conf() needs lang_sel() for the client documentSelector
        for (let name of all_langs) { mark_lang(name) }
        i_c_fn_head_opts.been_set = true;
        i_c_fn_head_opts.path_to_conf = uri[0].fsPath;
        await conf(context);
        // providers only after conf(), so the first provideDocumentSymbols
        // already has a client instead of logging "no lsp client"
        await reg_sym_providers(context);
        //await custom_lsp(context);
        
        //vscode.window.showInformationMessage(msg);
      //  vscode.window.showInformationMessage(txt._0);
   // }
  //  catch (err) {
    //    await prnt("Sorry, Dear Dev.. it was failed to init i_c_fn_head (" + String(err) + " )", rank_msg.err);
      //  return;
    // }
    regDefProvider(context);
    colors(context);
}
function run_opt(key: string): RegExp {
    return new RegExp(`^[ \t]*\/\/[ \t]*run[ \t]+${key}[ \t]*\/\/[ \t\r]*$`, "m");
}
export function msg_opt(key: string): RegExp {
    return new RegExp(`^[ \t]*\/\/[ \t]*msg\.${key}[ \t]*\/\/[ \t\r]*$`, "m");
}
const all_langs: string[] = ["D", "Rust", "C", "CPP", "Java"];
function mark_lang(name: string): void {
    if (run_opt(name).test(txt._0)) { enable_lang(name) }
}
async function reg_sym_providers(context: vscode.ExtensionContext): Promise<void> {
    for (let name of all_langs) {
        if (!flag_of_lang(name)) {
            await prnt("set_lang: " + name + " not in opts", rank_msg.dbg);
            continue
        }
        // every id the document may carry, see lang_ids in faav.ts
        for (let id of ids_of_lang(name)) {
            context.subscriptions.push(
                vscode.languages.registerDocumentSymbolProvider({ language: id }, new ShowDocumentSymbols())
            );
        }
        await prnt("set_lang: " + name + " registered for " + JSON.stringify(ids_of_lang(name)), rank_msg.dbg);
    }
}
class txt {
    static _0: string = "";
}
export function regDefProvider(context: & vscode.ExtensionContext) {
     const selector: vscode.DocumentSelector = doc_sel();
     context.subscriptions.push(
       vscode.languages.registerDefinitionProvider(selector, new langDefinitionProvider())
     );
     prnt("regDefProvider: selector " + JSON.stringify(selector), rank_msg.dbg);
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
