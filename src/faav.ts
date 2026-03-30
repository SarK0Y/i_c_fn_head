import { GlobPattern } from "vscode";
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
    static provide_lang_D: boolean = true;
    static provide_lang_Rust: boolean = true;
}