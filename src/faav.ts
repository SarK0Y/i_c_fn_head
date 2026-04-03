import { GlobPattern } from "vscode";
import * as vsc from 'vscode';
export class langsName {
    static name: string = "c";
    static file_exts: string[] = ["c","h"];
}
export class restrict_search {
    static max_num_of_res: number = 2000;
    static exclude_paths: GlobPattern | null | undefined = "**/(tests|build)/**";
}
export class i_c_fn_head_opts {
    static path_to_conf: string = "";
    static been_set: boolean = false;
    static provide_lang_C: boolean = false;
    static provide_lang_CPP: boolean = false;
    static provide_lang_D: boolean = false;
    static provide_lang_Rust: boolean = false;
}
export class _block_head {
    name: string = "";
    lnum: number = 0;
    mark_fn_head: RegExp = /(fn\s.*\{?)|(\sfn\s.*\{?)/;
    set_info(strn: string, i: number, fn_head?: RegExp) {
        if (strn.length <= 1) { return; }
        this.name = strn;
        this.lnum = i;
        this.mark_fn_head = fn_head ?? this.mark_fn_head;
    }
    get_head(name7: string, i: number): string {
        let _name7 = name7.trim();
        if (this.mark_fn_head.test(_name7)) { return _name7; }
        return this.name;
    }
    try_set_info(strn: string, i: number) {
        if (strn.length <= 1) { return; }
        let tst = this.mark_fn_head.test(strn);
        if (!tst) { return; }
        this.name = strn;
        this.lnum = i;
    }
}
export class cmd_rgx {
    static #collect_rgx_from_doc: RegExp = /\/\/\s*rgx:\s*(.*)\s*\/\//;
    static _collect_rgx_from_doc(txt: string): RegExp[] {
        let m: RegExpExecArray | null;
        let ret: RegExp[] = [];
        while ((m = this.#collect_rgx_from_doc.exec(txt)) != null) {
            let try_it = this.strn_2_rgx(m[1]);
            if (try_it == null) { break}
            ret.push(try_it);
        }
        return ret;
    }
    static strn_2_rgx(strn: string): RegExp | null {
        try {
            return new RegExp(strn);
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            vsc.window.showInformationMessage(msg);
            return null;
        }
    }
}