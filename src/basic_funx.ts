import * as vscode from 'vscode';
import { uri_to_file_of_opts } from './fs_stuff';
import { msg_opt } from './init';
import { rank_msg } from './faav';
class set_cmd_type {
    static v: string = "rgx";
}
export async function prnt(msg: string, rank?: rank_msg) {
    if ( (await msg_mode(rank ?? "info")) == false) { return }
    let label = "[msg.info]";
    switch (rank) {
        case rank_msg.dbg: { label = "[msg.dbg]"; break; }
        case rank_msg.err: { label = "[msg.err]"; break; }
        case rank_msg.warn: { label = "[msg.warn]"; break; }
    }
    console_msg.show(label + ": " + msg);
}
export class console_msg {
    static #outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    static show(msg: string) {
        this.#outputChannel.appendLine(msg);
        this.#outputChannel.show();
    }
}
export async function getCMD(set_placeholder0?: string | null, _txt?: string | undefined | null,  cmd_type?: string): Promise< RegExp[] | null> {
    const txt = _txt ? _txt : vscode.window.activeTextEditor?.document.getText();
    set_cmd_type.v = cmd_type ? cmd_type : set_cmd_type.v;
    cmd_rgx.set_collect_rgx_from_doc();
    if (txt == undefined) { return null}
    const ret = set_placeholder0 ? await cmd_rgx._collect_rgx_from_doc(txt, set_placeholder0) : await cmd_rgx._collect_rgx_from_doc(txt); 
    let phldr = set_placeholder0 ? set_placeholder0 : "no phldr";
    await prnt("calc num of cmds: " + ret.length.toString());
   // prnt (ewt)
    return ret;
}
export class cmd_rgx {
    static collect_rgx_from_doc: RegExp = /\/\/\s*rgx:\s*(\/.*:::[gmis]*)\s*\/\//g;
    static placeholder0: string = "@663@";
    static placeholder0_max_len: number = 200;
    static open_rgx: string = "/";
    static close_rgx: string = ":::";
    static async set_collect_rgx_from_doc(
        open_rgx?: string,
        close_rgx?: string,
    ): Promise <RegExp> {
        this.open_rgx = open_rgx ?? this.open_rgx;
        this.close_rgx = close_rgx ?? this.close_rgx;
        let cmd_type = set_cmd_type.v ?? "rgx";
        let construct_rgx: string = "//\\s*" + cmd_type + ":\\s*(" + this.open_rgx + ".*" + this.close_rgx + "[gmis]*)\\s*//";
        this.collect_rgx_from_doc = new RegExp(construct_rgx, "g");
        await prnt("set_collect_rgx_from_doc: "+this.collect_rgx_from_doc.source);
        return this.collect_rgx_from_doc;
    }
    static async _collect_rgx_from_doc(txt: string, set_placeholder0?: string): Promise <RegExp[]> {
        if (set_placeholder0) { return this._collect_rgx_from_doc0(txt, set_placeholder0) }
        let m: RegExpExecArray | null;
        let ret: RegExp[] = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let try_it = await this.strn_2_rgx(m[1]);
            if (try_it == null) {
                await prnt("_collect_rgx_from_doc: try_it is null");
                break
            }
            await prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static async _collect_rgx_from_doc0(txt: string, set_placeholder0: string): Promise <RegExp[]> {
        let m: RegExpExecArray | null;
        let ret: RegExp[] = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let _m = m[1].replaceAll(this.placeholder0, set_placeholder0);
            let try_it = await this.strn_2_rgx(_m);
            await prnt("1st class cmd_rgx");
            if (try_it == null) {
                await prnt("_collect_rgx_from_doc: try_it is null");
                break
            }
            await prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static async strn_2_rgx(strn: string): Promise <RegExp | null> {
        let check_end_of_rgx = this.close_rgx + "[gmis]*$";
        let flags = strn.match(new RegExp(check_end_of_rgx));
        let _flags = flags != null ? flags[0].slice(this.close_rgx.length) : "";
        let regex = strn.slice(1).replaceAll(this.close_rgx + _flags, "");
        try {
            let ret = new RegExp(regex, _flags);
            await prnt("strn to rgx: " + ret.source + " " + ret.flags);
            return ret;
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            vscode.window.showInformationMessage(msg);
            return null;
        }
    }
}
export async function exclude_paths(uris: vscode.Uri[]): Promise<vscode.Uri[] |  undefined> {
    try {
        exclude_uris.v = uris;
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(txt);
        let exclude_paths0 = await getCMD(
            null,
            txt,
            "exclude_path"
        );
        if (exclude_paths0 == null) { return; }
        for (let exc of exclude_paths0) {
            await exclude_path(exc);
        }
        return exclude_uris.v;
    } catch (err) {
        await prnt("exclude path: " + String(err), rank_msg.err);
        return
    }
}
async function exclude_path(rgx: RegExp): Promise <void> {
    
    for (let i = 0; i < exclude_uris.v.length; i++) {
        await prnt(rgx.source);
        exclude_uris.s[i] = exclude_uris.v[i].fsPath.trim();
        if (exclude_uris.s[i].match(rgx) != null) {
            await prnt(exclude_uris.s[i]);
            exclude_uris.s.splice(i, 1)
            exclude_uris.v.splice(i, 1)
        }
    }
}
async function exclude_path1(uris: vscode.Uri[], rgx: RegExp): Promise<vscode.Uri[]> {
    let ret: vscode.Uri[] = [];
    for (let uri of uris) {
        await prnt(rgx.source);
        if (uri.fsPath.match(rgx) == null) { ret.push(uri) }
    }
    return ret;
}

export function msg_rank_2_strn(rank: rank_msg): string {
    let label = "info";
    switch (rank) {
        case rank_msg.dbg: { label = "[msg.dbg]"; break; }
        case rank_msg.err: { label = "[msg.err]"; break; }
        case rank_msg.warn: { label = "[msg.warn]"; break; }
    }
    return label;
}
export function _msg_rank_2_strn(rank: rank_msg): string {
    let label = "info";
    switch (rank) {
        case rank_msg.dbg: { label = "dbg"; break; }
        case rank_msg.err: { label = "err"; break; }
        case rank_msg.warn: { label = "warn]"; break; }
    }
    return label;
}
export async function msg_mode(rank: rank_msg | string): Promise <boolean> {
    let mode = typeof rank == "string" ? rank : _msg_rank_2_strn(rank);
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        if (msg_opt("all").test(txt)) { return true; }
        if (msg_opt(mode).test(txt)) { return true; }
        return false;
    } catch (err) {
        await prnt("msg mode: " + String(err), rank_msg.err);
        return false;
    }
}
export class exclude_uris {
    static v: vscode.Uri[] = []
    static s: string[] = []
}
