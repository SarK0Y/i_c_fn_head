import { GlobPattern } from "vscode";
import * as vsc from 'vscode';
import { prnt } from "./basic_funx";
export function langsName(): {name: string, file_exts: string []} {
    let langId = vsc.window.activeTextEditor?.document.languageId;
    if (langId == undefined) {
        return { name: "", file_exts: [] };
    }
    switch (langId.toLowerCase()) {
        case "c": { return { name: "C", file_exts: ["c", "h"] }; }
        case "d": { return { name: "D", file_exts: ["d"] }; }
        case "rust": { return { name: "Rust", file_exts: ["rs"] }; }
        case "cpp": { return { name: "CPP", file_exts: ["cpp", "hpp", "h"] }; }
        default: { return { name: "", file_exts: [] }; }
    }
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
