import * as vscode from 'vscode';
import {i_c_fn_head_opts} from 'faav';
export function init () {
    if (!i_c_fn_head_opts.been_set) {return; }
    const uri = await vscode.workspace.findFiles(
      '**/*.{langsName.file_exts}',
      "", /* exclude none path */ 
      1 /* only one result */
    );
    try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const txt = doc.getText();
    }
    catch {}
}