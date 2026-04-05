import * as vscode from 'vscode'
import { cmd_rgx } from './faav';
import { prnt } from './basic_funx';
import { langsName, restrict_search } from './faav';
export enum F12_action {
    cont,
    stop
}
export type pressF12 = { kind: "F12_action", v: F12_action };
export type EL = { kind: "extra_locations", v: vscode.Location[] };
export function new_EL(v?: vscode.Location[]): EL {
    let ret = v ? v : [] as vscode.Location [];
    return { kind: "extra_locations", v: ret };
}
export function new_pressF12(v?: F12_action): pressF12 {
    let ret = v ? v : F12_action.cont;
    return { kind: "F12_action", v: ret };
}
export function getCMD(set_placeholder0?: string): RegExp[] | null {
    const txt = vscode.window.activeTextEditor?.document.getText();
    if (txt == undefined) { return null}
    const ret = set_placeholder0 ? cmd_rgx._collect_rgx_from_doc(txt, set_placeholder0) : cmd_rgx._collect_rgx_from_doc(txt); 
    let phldr = set_placeholder0 ? set_placeholder0 : "no phldr";
    prnt(phldr);
   // prnt (ewt)
    return ret;
}
export function handleExtraCMDs(set_placeholder0?: string): EL | pressF12 {
    let cmds: RegExp[] | null = set_placeholder0 ? getCMD(set_placeholder0) : getCMD(); 
    let f12: pressF12 = new_pressF12();
    if (cmds == null) { f12.v = F12_action.cont;  return f12 ; }
    let more_rgxs = handle_rgx_cmd(cmds);
    if (more_rgxs.length > 0) { return new_EL (more_rgxs); }
    return new_pressF12 (F12_action.cont);
}
function handle_rgx_cmd(cmds: RegExp[]): vscode.Location[] {
    const txt = vscode.window.activeTextEditor?.document.getText();
    if (txt == undefined) { return []}
    const res: vscode.Location[] = [];
    let matches: RegExpStringIterator<RegExpExecArray> | null;
    let matches0: RegExpMatchArray | null;
    for (let rgx of cmds) { 
        prnt("rgx source:" +rgx.source);
       // if (cmd.source.includes("rgx:")) {
          //  let extract = cmd.source.replace(/\/\/\s*rgx:/, "").replace(/\/\/$/, "").trim();
            //prnt("extract:" + extract);
            matches = txt.matchAll(rgx);
            if (matches == null) { continue; }
            res.push(...calc_locations(matches));
        //}
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
    let _1st_ch_indx = 0;
    for (let m of matches) {
        let len = m[0].length;
        _1st_ch_indx = txt.indexOf(m[0], _1st_ch_indx + 1);
        if (_1st_ch_indx == -1) { break; }
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
export async function get_files_in_workspace(): Promise <vscode.Uri[]> {
    let file_ext: vscode.GlobPattern = "**/*." + langsName.file_exts[0];
        let uris = await vscode.workspace.findFiles(
          //"**/*.d",
          file_ext,
          restrict_search.exclude_paths, 
          restrict_search.max_num_of_res);
        if (langsName.file_exts.length > 1) {
          for (let i = 1; i < langsName.file_exts.length; i++) {
            file_ext = "**/*." + langsName.file_exts[i];
            let uri = await vscode.workspace.findFiles(
              //   '**/*.{langsName.file_exts}',
                file_ext,
                restrict_search.exclude_paths,
                restrict_search.max_num_of_res);
            uris.push(...uri);
          }
        }
    return uris;
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