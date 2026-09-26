import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import { rank_msg, jHome as _JavaHome, kwFile as _kwFile } from "./faav";
import { cmd_rgx, prnt} from "./basic_funx";
import { promisify } from "util";
import { sync_bkp } from "./basic_funx";
const _readdir = promisify(fs.readdir);
// one directive per line: //key: value// , so the closing // is pinned to the
// end of the line and the value may hold any number of //
function dir_rgx(key: string, value: string): RegExp {
    return new RegExp(
        "^[ \\t]*//[ \\t]*" + key + "[ \\t]*:[ \\t]*" + value +
        "(?:" + cmd_rgx.close_rgx + "[gims]*)?[ \\t]*//[ \\t\\r]*$",
        "gm");
}
export async function include_subdirs(): Promise<string[]> {
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        let ret: string[] = [];
        for (let key of ["include_subdir", "include_subdirs"]) {
            let rgx = dir_rgx(key, "(\\/.*?)");
            prnt("include_subdirs: " + rgx.source, rank_msg.dbg);
            for (let m of txt.matchAll(rgx)) {
                prnt("include_subdirs: " + m[1], rank_msg.dbg);
                ret.push(m[1]);
            }
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
export async function JavaHome(): Promise<string> {
    if (_JavaHome.jh != "" ){ return _JavaHome.jh}
    let fn_name = "jHome";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(fn_name + ": " + txt, rank_msg.dbg);
        let tst: string = "^[ \\t]*//[ \\t]*" + fn_name + "[ \\t]*:[ \\t]*" + "([^\\r\\n]*?)" + "[ \\t]*(?:" + cmd_rgx.close_rgx + ")?[ \\t]*//[ \\t\\r]*$";
        let rgx = RegExp(tst, "gm");
        prnt(fn_name + ": " + rgx.source, rank_msg.dbg);
        let jhome = txt.matchAll(rgx);
        sync_bkp.raw_writeBkp(jhome.toString(), null, "/tmp/jar");
        let _jhome: string = "";
        for (let m of jhome) {
            sync_bkp.raw_appendBkp(m[0], null, "/tmp/jar");
            sync_bkp.raw_appendBkp(m[1], null, "/tmp/jar");
            if (m[1] != "") {
                _jhome = m[1];
            }
        }
        _JavaHome.jh = _jhome;
        return _JavaHome.jh
    } catch (err) {
        await prnt(fn_name + ": " + String(err), rank_msg.err);
    }
    return ""
}
export async function Jar(): Promise<string> {
    if (_JavaHome.j != "") { return _JavaHome.j }
    let fn_name = "Jar";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(fn_name + ": " + txt, rank_msg.dbg);
        let tst: string = "^[ \\t]*//[ \\t]*" + fn_name.slice(0, fn_name.length) + "[ \\t]*:[ \\t]*" + "(\\/.*?)" + "[ \\t]*(?:" + cmd_rgx.close_rgx + ")?[ \\t]*//[ \\t\\r]*$";
        let rgx = RegExp(tst, "gm");
        sync_bkp.raw_writeBkp(rgx.source, null, "/tmp/rgx");
        prnt(fn_name + ": " + rgx.source, rank_msg.dbg);
        let jar = txt.matchAll(rgx);
        sync_bkp.raw_writeBkp(jar.toString(), null, "/tmp/jar");
        let _jar: string = "";
        for (let m of jar) {
            sync_bkp.raw_appendBkp(m[0], null, "/tmp/jar");
            sync_bkp.raw_appendBkp(m[1], null, "/tmp/jar");
            if (m[1] != "") {
                _jar = m[1];
            }
        }
        _JavaHome.j = _jar;
        return _JavaHome.j
    } catch (err) {
        await prnt(fn_name + ": " + String(err), rank_msg.err);
    }
    return ""
}
export async function KeywordsFiles(): Promise<Map<string, string>> {
    if (_kwFile.files.size > 0) { return _kwFile.files }
    let fn_name = "keywordsFile";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(fn_name + ": " + txt, rank_msg.dbg);
        let tst: string = "^[ \t]*//[ \t]*" + fn_name + "[ \t]*:[ \t]*" + "([^\r\n]*?)" + "[ \t]*(?:" + cmd_rgx.close_rgx + ")?[ \t]*//[ \t\r]*$";
        let rgx = RegExp(tst, "gm");
        prnt(fn_name + ": " + rgx.source, rank_msg.dbg);
        let kw_files = txt.matchAll(rgx);
        for (let m of kw_files) {
            for (let pair of m[1].split(/[\s,]+/)) {
                let eq = pair.indexOf("=");
                if (eq < 1) { continue }
                let lang = pair.slice(0, eq).trim().toLowerCase();
                let file = pair.slice(eq + 1).trim();
                if (lang == "" || file == "") { continue }
                prnt(fn_name + ": " + lang + " -> " + file, rank_msg.dbg);
                _kwFile.files.set(lang, file);
            }
        }
        return _kwFile.files
    } catch (err) {
        await prnt(fn_name + ": " + String(err), rank_msg.err);
    }
    return _kwFile.files
}
export async function KeywordsFileOf(lang: string): Promise<string> {
    let files = await KeywordsFiles();
    return files.get(lang.trim().toLowerCase()) ?? "";
}
export async function include_dirs(): Promise<vscode.Uri[]> {
    let fn_name = "include_dirs";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(fn_name + ": " + txt, rank_msg.dbg);
        let rgx = dir_rgx(fn_name.slice(0, fn_name.length - 1), "(" + cmd_rgx.open_rgx + ".*?)");
        prnt(fn_name + ": " + rgx.source, rank_msg.dbg);
        let collect_includes = txt.matchAll(rgx);
        let paths: string[] = [];
        for (let m of collect_includes) {
            prnt(fn_name + ": " + m[1], rank_msg.dbg);
            paths.push(m[1]);
        }
        return collect_dirs (paths);
    } catch (err) {
        await prnt(fn_name + ": " + String(err), rank_msg.err);
    }
    return []
}
export async function collect_dirs(paths: string[]): Promise<vscode.Uri[]> {
    let ret: vscode.Uri[] = []
    let uris: vscode.Uri[] = []
    for (let p of paths) {
        prnt("collect_dirs: " + p, rank_msg.dbg);
        uris.push(...await include_dir(p));
        prnt("collect_dirs: " + uris.length, rank_msg.dbg);
        if (uris.length > 0) {
            ret.push(...uris);
        }
    }
    return ret
}
export async function include_dir(dir: string): Promise <vscode.Uri[]> {
    let ret: vscode.Uri[] = []
    try {
        const entries = await _readdir(dir, { withFileTypes: true }) as fs.Dirent[];
        let x = entries
            .filter(e => e.isFile())
            .map(e => vscode.Uri.file(path.join(dir, e.name)));
        ret.push(...x);
    } catch (err) {
        prnt("include_dir: " + String(err), rank_msg.err);
        return [];
    }
    prnt("include_dir: " + "ret len: " + ret.length, rank_msg.dbg);
    return ret;
}
export async function uri_to_file_of_opts(): Promise <vscode.Uri[]> {
    return vscode.workspace.findFiles(
        '**/i_c_fn_head.opts',
        "", /* exclude none path */
        1 /* only one result */
    );
}
/*
import { readdir } from "fs";

export function include_dir(dir: string): Promise<vscode.Uri[]> {
  return new Promise(resolve => {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) { resolve([]); return; }
      const filesUris = files.filter(e=>e.isFile()).map(e=>vscode.Uri.file(path.join(dir, e.name)));
      resolve(filesUris);
    });
  });
}

 */