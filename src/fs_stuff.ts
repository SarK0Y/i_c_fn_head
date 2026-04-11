import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

import { rank_msg } from "./faav";
import { cmd_rgx, prnt } from "./basic_funx";
export async function include_subdirs(): Promise<string[]> {
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt("include_subdirs: " + txt, rank_msg.dbg);
        let tst: string = "//include_subdirs:\\s*" + cmd_rgx.open_rgx + "(\\/[a-zA-Z/_\.0-9\-\*]+)" + "\\s*" + cmd_rgx.close_rgx + "//";
        let rgx = RegExp(tst, "g");
        prnt("include_subdirs: " + rgx.source, rank_msg.dbg);
        let collect_includes = txt.matchAll(rgx);
        let ret: string[] = [];
        for (let m of collect_includes) {
            prnt("include_subdirs: " + m[1], rank_msg.dbg);
            ret.push(m[1]);
        }
        return ret;
    } catch (err) {
        await prnt("include_subdirs: " + String(err), rank_msg.err);
    }
    return []
}
export async function collect_subdirs(): Promise<vscode.Uri[]> {
    let paths = await include_subdirs();
    let ret: vscode.Uri[] = [];
    for (let p of paths) {
        let find = await vscode.workspace.findFiles(
            new vscode.RelativePattern(vscode.Uri.file(p), '**/*'),
            "" /* exclude none path */
            /* only one result */
        );
        if (find) {
            prnt("collect_subdirs: " + find.toString(), rank_msg.dbg);
            ret.push(...find)
        }
    }
    return ret;
}
export async function listNonRecursive(dir: string): Promise<vscode.Uri[]> {
    let ret: vscode.Uri[] = []
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            prnt("listNonRecursive: " + String(err), rank_msg.dbg);
            return [];
        }
        ret.push(...files
            .filter(e => e.isFile())
            .map(e => vscode.Uri.file(path.join(dir, e.name)))
        );
    });
    return ret;
}
export async function uri_to_file_of_opts(): Promise <vscode.Uri[]> {
    return vscode.workspace.findFiles(
        '**/i_c_fn_head.opts',
        "", /* exclude none path */
        1 /* only one result */
    );
}