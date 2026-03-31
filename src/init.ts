import * as vscode from 'vscode';
import { i_c_fn_head_opts } from './faav';
import { langDefinitionProvider } from './goto_impl';
import { Schema } from 'inspector/promises';
export async function init(context: & vscode.ExtensionContext) {
    if (!i_c_fn_head_opts.been_set) { return; }
    const uri = await vscode.workspace.findFiles(
        '**/i_c_fn_head.opts',
        "", /* exclude none path */
        1 /* only one result */
    );
    try {
        const doc = await vscode.workspace.openTextDocument(uri[0]);
        txt._0 = doc.getText();
        set_lang("D");
        set_lang("Rust");
        set_lang("C");
        set_lang("CPP");
        i_c_fn_head_opts.been_set = true;
        i_c_fn_head_opts.path_to_conf = uri[0].fsPath;
    }
    catch { }
    regDefProvider(context);
    const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    outputChannel.appendLine(i_c_fn_head_opts.path_to_conf);
    outputChannel.show();
    console.log(i_c_fn_head_opts.path_to_conf);
}
function run_opt(key: string): RegExp {
    return /\/\/\s*run\s+{key}\s*\/\//;
}
function set_lang(name: string) {
    if (run_opt(name).test(txt._0)) { eval("i_c_fn_head_opts.provide_lang_" + name + "= true"); }
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
    let sel: vscode.DocumentSelector = [];
    let sel_strn: string = "";
    if (i_c_fn_head_opts.provide_lang_C) { sel_strn += addSel("C") }
    if (i_c_fn_head_opts.provide_lang_Rust) { sel_strn += addSel("Rust") }
    if (i_c_fn_head_opts.provide_lang_CPP) { sel_strn += addSel("CPP") }
    if (i_c_fn_head_opts.provide_lang_D) { sel_strn += addSel("D") }
    sel = eval(sel_strn);
    return sel
}
function addSel(lang: string): string {
    return "{ scheme: 'file', language: lang },";    
}