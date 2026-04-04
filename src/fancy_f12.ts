import * as vscode from 'vscode'
import { cmd_rgx } from './faav';
export function getCMD(set_placeholder0?: string): RegExp[] | null {
    const txt = vscode.window.activeTextEditor?.document.getText();
    if (txt == undefined) { return null}
    const ret = set_placeholder0 ? cmd_rgx._collect_rgx_from_doc(txt, set_placeholder0) : cmd_rgx._collect_rgx_from_doc(txt); 
    return null
}
export function handleExtraCMDs(set_placeholder0?: string) {
    let cmds = set_placeholder0 ? getCMD(set_placeholder0) : getCMD(); 
    
}
function handle_rgx_cmd(cmds: RegExp[]): vscode.Location[] {
    const txt = vscode.window.activeTextEditor?.document.getText();
    if (txt == undefined) { return []}
    const res: vscode.Location[] = [];
    let matches: RegExpStringIterator <RegExpExecArray> | null;
    for (let cmd of cmds) { 
        if (cmd.source.includes("rgx:")) {
            matches = txt.matchAll(cmd);
            if (matches == null) { continue; }
            res.push(...calc_locations(matches));
        }
    }
    return res;
}
function calc_locations(matches: RegExpStringIterator<RegExpExecArray>): vscode.Location[] {
    const doc = vscode.window.activeTextEditor?.document;
    if (doc == undefined) { return [] }
    const txt = doc.getText();
    const uri = doc.uri;    
    let res: vscode.Location[] = []; 
    let Start = new vscode.Position(0, 0);
    let End = new vscode.Position(0, 0);
    let pos: number = 0;
    for (let m of matches) {
        let len = m[0].split(" ")[0].length;
        let _1st_ch_indx = txt.indexOf(m[0], pos);
        if (_1st_ch_indx == -1) { break; }
        pos = _1st_ch_indx;
        Start = doc.positionAt(_1st_ch_indx);
        End = doc.positionAt(_1st_ch_indx + len);
        res.push(new vscode.Location ( uri, new vscode.Range(Start, End)));

    }
    return res;
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