import * as vscode from 'vscode';
import { uri_to_file_of_opts } from './init';
class set_cmd_type {
    static v: string = "rgx";
}
export function prnt(msg: string) {
    console_msg.show(msg);
}
export class console_msg {
    static #outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    static show(msg: string) {
        this.#outputChannel.appendLine(msg);
        this.#outputChannel.show();
    }
}
export function getCMD(set_placeholder0?: string | null, _txt?: string | undefined | null,  cmd_type?: string): RegExp[] | null {
    const txt = _txt ? _txt : vscode.window.activeTextEditor?.document.getText();
    set_cmd_type.v = cmd_type ? cmd_type : set_cmd_type.v;
    cmd_rgx.set_collect_rgx_from_doc();
    if (txt == undefined) { return null}
    const ret = set_placeholder0 ? cmd_rgx._collect_rgx_from_doc(txt, set_placeholder0) : cmd_rgx._collect_rgx_from_doc(txt); 
    let phldr = set_placeholder0 ? set_placeholder0 : "no phldr";
    prnt("calc num of cmds: " + ret.length.toString());
   // prnt (ewt)
    return ret;
}
export class cmd_rgx {
    static collect_rgx_from_doc: RegExp = /\/\/\s*rgx:\s*(\/.*:::[gmis]*)\s*\/\//g;
    static placeholder0: string = "@663@";
    static placeholder0_max_len: number = 200;
    static open_rgx: string = "/";
    static close_rgx: string = ":::";
    static set_collect_rgx_from_doc(
        open_rgx?: string,
        close_rgx?: string,
    ): RegExp {
        this.open_rgx = open_rgx ?? this.open_rgx;
        this.close_rgx = close_rgx ?? this.close_rgx;
        let cmd_type = set_cmd_type.v ?? "rgx";
        let construct_rgx: string = "//\\s*" + cmd_type + ":\\s*(" + this.open_rgx + ".*" + this.close_rgx + "[gmis]*)\\s*//";
        this.collect_rgx_from_doc = new RegExp(construct_rgx, "g");
        prnt("set_collect_rgx_from_doc: "+this.collect_rgx_from_doc.source);
        return this.collect_rgx_from_doc;
    }
    static _collect_rgx_from_doc(txt: string, set_placeholder0?: string): RegExp[] {
        if (set_placeholder0) { return this._collect_rgx_from_doc0(txt, set_placeholder0) }
        let m: RegExpExecArray | null;
        let ret: RegExp[] = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let try_it = this.strn_2_rgx(m[1]);
            if (try_it == null) {
                prnt("_collect_rgx_from_doc: try_it is null");
                break
            }
            prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static _collect_rgx_from_doc0(txt: string, set_placeholder0: string): RegExp[] {
        let m: RegExpExecArray | null;
        let ret: RegExp[] = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let _m = m[1].replaceAll(this.placeholder0, set_placeholder0);
            let try_it = this.strn_2_rgx(_m);
            prnt("1st class cmd_rgx");
            if (try_it == null) {
                prnt("_collect_rgx_from_doc: try_it is null");
                break
            }
            prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static strn_2_rgx(strn: string): RegExp | null {
        let check_end_of_rgx = this.close_rgx + "[gmis]*$";
        let flags = strn.match(new RegExp(check_end_of_rgx));
        let _flags = flags != null ? flags[0].slice(this.close_rgx.length) : "";
        let regex = strn.slice(1).replaceAll(this.close_rgx + _flags, "");
        try {
            let ret = new RegExp(regex, _flags);
            prnt("strn to rgx: " + ret.source + " " + ret.flags);
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
        let ret: vscode.Uri[] = [];    
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(txt);
        let exclude_paths0 = getCMD(
            null,
            txt,
            "exclude_path"
        );
        if (exclude_paths0 == null) { return; }
        for (let exc of exclude_paths0) {
            ret = exclude_path(uris, exc);
        }
        return ret.length == 0? uris: ret;
    } catch (err) {
        prnt(String(err))
        return
    }
}
function exclude_path(uris: vscode.Uri[], rgx: RegExp): vscode.Uri[] {
    let ret: vscode.Uri[] = [];
    for (let uri of uris) {
        prnt(rgx.source);
        if (!uri.fsPath.match(rgx)) { ret.push (uri)}
    }
    return ret;
}