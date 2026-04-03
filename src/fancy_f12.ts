import * as vscode from 'vscode'
import { cmd_rgx } from './faav';
export function getCMD(): RegExp[] | null {
    const txt = vscode.window.activeTextEditor?.document.getText();
    if (txt == undefined) { return null}
    const ret = cmd_rgx._collect_rgx_from_doc (txt)
    return null
}
function cursorPos(): vscode.Position | null {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;
    const pos = editor.selection.active;
   // const line = pos.line;
    // const col = pos.character;
    return pos; 
}
/*
function handleChangeSel(event: vscode.TextEditorSelectionChangeEvent) {
    console.log("Change in the text editor");
    for (var i = 0; i < event.selections.length; i++) {
        var selection = event.selections[i];
        console.log("Start- Line: (" + selection.start.line + ") Col: (" + selection.start.character + ") End- Line: (" + selection.end.line + ") Col: (" + selection.end.character + ")");
    }
    var scroll = vscode.workspace.getConfiguration("editorScroll");
    console.log(event);
    var doc: vscode.TextDocument = vscode.workspace.textDocuments[0];
    let msg = "status bar: " + doc.getText();
    console.log(msg);
}
vscode.window.onDidChangeTextEditorSelection(handleChangeSel);
*/