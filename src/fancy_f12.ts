import * as vscode from 'vscode'
import { rank_msg } from './faav';
import { prnt } from './basic_funx';
import { uri_to_file_of_opts } from './fs_stuff';
import { def_loc, srv_definitions } from './lsp_lang';

const word_rgx: RegExp = /[\w$@_]+/;

function to_location(l: def_loc): vscode.Location | null {
    try {
        const start = new vscode.Position(l.range.start.line, l.range.start.character);
        const end = new vscode.Position(l.range.end.line, l.range.end.character);
        return new vscode.Location(vscode.Uri.parse(l.uri), new vscode.Range(start, end));
    } catch (err) {
        prnt("to_location: " + String(err), rank_msg.err);
        return null;
    }
}

// F12: the jar resolves the //rgx:// commands of the opts file and searches
// the workspace, so nothing is searched here and there is no local fallback
export async function definitions(
    doc: vscode.TextDocument,
    position: vscode.Position,
    token?: vscode.CancellationToken
): Promise<vscode.Location[]> {
    const ret: vscode.Location[] = [];
    const wordRange = doc.getWordRangeAtPosition(position, word_rgx);
    if (wordRange == undefined) { return ret }
    const word = doc.getText(wordRange);
    if (word == "") { return ret }
    const file_of_opts = await uri_to_file_of_opts();
    if (file_of_opts.length == 0) {
        await prnt("definitions: no i_c_fn_head.opts found", rank_msg.err);
        return ret;
    }
    await prnt("definitions: " + word + " -> " + file_of_opts[0].fsPath, rank_msg.dbg);
    const locs = await srv_definitions(file_of_opts[0].toString(), doc.uri.toString(), word);
    for (let l of locs) {
        if (token?.isCancellationRequested) { break }
        const loc = to_location(l);
        if (loc != null) { ret.push(loc) }
    }
    await prnt("definitions: " + word + " -> " + ret.length + " locations", rank_msg.dbg);
    return ret;
}
