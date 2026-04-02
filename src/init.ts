import * as vscode from 'vscode';
import { i_c_fn_head_opts, langsName } from './faav';
import { langDefinitionProvider } from './goto_impl';
import { activate0 as colors } from './colorful';
export async function init(context: & vscode.ExtensionContext) {
   // if (!i_c_fn_head_opts.been_set) { return; }
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
        let msg = "hi there from init D is " + i_c_fn_head_opts.provide_lang_D.toString();
        //vscode.window.showInformationMessage(msg);
        vscode.window.showInformationMessage(txt._0);
    }
    catch { }
    regDefProvider(context);
    colors(context);
    const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    outputChannel.appendLine(i_c_fn_head_opts.path_to_conf);
    outputChannel.show();
    console.log(i_c_fn_head_opts.path_to_conf);
}
function run_opt(key: string): RegExp {
    return new RegExp(`\\/\\/\\s*run\\s+${key}\\s*\\/\\/`);
}
function set_lang(name: string) {
    //vscode.window.showInformationMessage(txt._0);
    if (run_opt(name).test(txt._0) && name == "D") {
        i_c_fn_head_opts.provide_lang_D = true;
        langsName.file_exts = ["d"];
    }
    if (run_opt(name).test(txt._0) && name == "CPP") {
        i_c_fn_head_opts.provide_lang_CPP = true;
        langsName.file_exts = ["cpp", "hpp", "h"];
    }
    if (run_opt(name).test(txt._0) && name == "C") {
        i_c_fn_head_opts.provide_lang_C = true;
        langsName.file_exts = ["c", "h"];
    }
    if (run_opt(name).test(txt._0) && name == "Rust") {
        i_c_fn_head_opts.provide_lang_Rust = true;
        langsName.file_exts = ["rs"];
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