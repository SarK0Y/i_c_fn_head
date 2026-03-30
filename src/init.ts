import * as vscode from 'vscode';
import { i_c_fn_head_opts } from './faav';
export async function init() {
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
    }
    catch { }
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