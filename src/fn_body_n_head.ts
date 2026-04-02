import * as vscode from 'vscode';
import { writeFileSync, readFileSync, copyFileSync, closeSync, existsSync, rmSync } from "fs";
import { _block_head} from './faav'
export function _c_fn_body(doc: string | string[], uri: vscode.Uri, symbols: & vscode.SymbolInformation[]) {
    let c_like: lang_element = new lang_element();
    c_like.exclude_strns = /(\"[\s\S]*?\")/gm
    let tmp_doc: string = Array.isArray(doc) ? function (arr: string[]): string {
        let ret: string = "";
        arr.forEach(function (strn: string) {
            ret += strn;
        });
        return ret;
    }(doc) : doc;
    let beeped_doc = bee_ep(tmp_doc, c_like.exclude_strns, "#");
    let lines: string[] = beeped_doc.split("\n");
    let orig_lines: string[] = typeof doc == "string" ? doc.split("\n") : doc;
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    c_like.uri = uri;
    if (!c_like.set_lines(lines, orig_lines)) { return; }
    c_like.exclude_comments = /(\/\/.*)|(\/\*.*(\/)?)/g;//|([\"\'\`].*[\"\'\`])/g;
    c_like.one_line_comment = /^[/]{2}/;
    c_like.one_line_block = /.*\{.*\}.*/;
    c_like.open_comment = /^\/\*/;
    c_like.close_comment = /\*\/$/;
    const butterfly = /\}.*\{/;
    c_like.open_block = /\{/g;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
    c_like.close_block = /\}/g;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
    c_like.tst_class = /^(class|struct|enum)\s|\s(class|struct|enum)\s/i;
    c_like.block_head.mark_fn_head = /.*/;
    for (let i = 0; i < lines.length; i++) {
        if (c_like.one_line_comment7(i)) { continue; }
        if (c_like.within_comment7(i)) { continue; }
        //if (skip.run(lines[i])) { continue; }
        if (c_like.class_entry7(i)) { continue; }
        c_like.head7(i);
        if (c_like.one_line_block7(i)) { continue; }
        c_like.block_entry7(i);
        //if (c_like.block_entry7(i)) { continue; }
        if (c_like.close_class7(i)) { continue; }
        c_like.update_block_state(i);
        if (c_like.close_block7(i)) { continue; }
        //if (yea_class) { yea_class = false; continue; }
    }
    symbols.push(...c_like.symbols);
}
export function bee_ep(txt0: string, rgx: RegExp, symb: string): string {
    //const alt_nl = "/<==>/";
    let txt = txt0//.replaceAll ("\n", alt_nl);
    let for_beep: RegExpMatchArray | null = txt0.match(rgx);
    if (for_beep == null) { return txt; }
    let len = 0;
    for_beep.forEach(function (strn: string) {
        len = strn.length;
        let new_strn = "";
        for (let x = 0; x < len; x++) {
            if (strn[x] != "\n") { new_strn += symb }
            else { new_strn += "\n"; }
        }
        txt = txt.replace(strn, new_strn);
    });
    if (mode.dbg) {
        rmSync("/tmp/txt");
        writeFileSync("/tmp/txt", txt);
    }
    return txt;
}
export function rust_fn_body(doc: string | string[], uri: vscode.Uri, symbols: & vscode.SymbolInformation[]) {
    const exclude_strns: RegExp = /(\"[\s\S]*?\")/gm
    let tmp_doc: string = Array.isArray(doc) ? function (arr: string[]): string {
        let ret: string = "";
        arr.forEach(function (strn: string) {
            ret += strn;
        });
        return ret;
    }(doc) : doc;
    let beeped_doc = bee_ep(tmp_doc, exclude_strns, "#");
    let lines: string[] = beeped_doc.split("\n");
    let orig_lines: string[] = typeof doc == "string" ? doc.split("\n") : doc;
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    const exclude_comments: RegExp = /(\/\/.*)|(\/\*.*(\/)?)/g;//|([\"\'\`].*[\"\'\`])/g;
    const one_line_comment: RegExp = /^[/]{2}/;
    const one_line_block: RegExp = /.*\{.*\}.*/;
    const open_comment: RegExp = /^\/\*/;
    const close_comment: RegExp = /\*\/$/;
    const butterfly = /\}.*\{/;
    const open_block: RegExp = /\{/g;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
    const close_block: RegExp = /\}/g;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
    const tst_class: RegExp = /.*(trait|struct|impl|enum)\s/i;
    let opened_class = false;
    let within_comment: boolean = false;
    let within_quotes = false
    let start_class: number | null = null;
    let start_block: number | null = null;
    let block_state: number = 0;
    let sav_block_state = 0;
    let fn_head: string = "";
    let search_curlies: RegExpMatchArray | null = null;
    let ln: string;
    let no_comments = "";
    let block_head = new _block_head;
    let step_back = false;
    let step_back_was_used: boolean = false;
    for (let i = 0; i < lines.length; i++) {
        /*	if (step_back_was_used) {
                step_back_was_used = false;
                step_back = false;
            }
            if (step_back) { i--; step_back_was_used = true; step_back = false; }*/
        ln = lines[i];
        if (one_line_comment.test(ln)) {
            continue;
        }
        if (!within_comment) { within_comment = open_comment.test(lines[i].trim()); }
        if (within_comment) {
            if (close_comment.test(ln.trim())) {
                within_comment = false;
            }
            continue;
        }
        if (start_class == null && block_state == 0) {
            if (tst_class.test(lines[i])) {
                if (open_block.test(lines[i])) {
                    opened_class = true;
                }
                start_class = i;
                sav_block_state = block_state;
                continue;
            }
        }
        no_comments = lines[i].replaceAll(exclude_comments, "");
        block_head.try_set_info(no_comments, i);
        if (start_block == null && block_state == -1) {
            fn_head = block_head.name;
            start_block = i;
        }
        //if (one_line_block.test(ln) && block_state != 0) { continue; }
        if (one_line_block.test(ln) && block_state == 0 && block_head.name.length > 0) {
            add_symb(
                block_head.lnum,
                i,
                orig_lines[i],
                "Function",
                uri,
                symbols
            );
            block_head.name = "";
            continue;
        }
        //step_back = butterfly.test(lines[i]);
        if (start_class != null && block_state == 0 && close_block.test(lines[i])) {
            add_symb(
                start_class,
                i,
                orig_lines[start_class],
                "Class",
                uri,
                symbols
            );
            start_class = null;
            opened_class = false;
            continue;
        }
        block_state -= (search_curlies = no_comments.match(open_block)) != null ? search_curlies.length : 0;
        if (!opened_class && start_class != null && sav_block_state != block_state) {
            block_state += 1;
            opened_class = true;
        }
        block_state += (search_curlies = no_comments.match(close_block)) != null ? search_curlies.length : 0;
        //	block_head.set_info(lines[i], i);
        if (start_block != null && block_state == 0 && block_head.name.length > 0) {
            add_symb(
                block_head.lnum,
                i,
                block_head.name,
                "Function",
                uri,
                symbols
            );
            block_head.name = "";
            start_block = null;
        }
    }
}
export function _rust_fn_body(doc: string | string[], uri: vscode.Uri, symbols: & vscode.SymbolInformation[]) {
    let rust: lang_element = new lang_element();
    rust.exclude_strns = /(\"[\s\S]*?\")/gm
    let tmp_doc: string = Array.isArray(doc) ? function (arr: string[]): string {
        let ret: string = "";
        arr.forEach(function (strn: string) {
            ret += strn;
        });
        return ret;
    }(doc) : doc;
    let beeped_doc = bee_ep(tmp_doc, rust.exclude_strns, "#");
    let lines: string[] = beeped_doc.split("\n");
    let orig_lines: string[] = typeof doc == "string" ? doc.split("\n") : doc;
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    rust.uri = uri;
    if (!rust.set_lines(lines, orig_lines)) { return; }
    rust.exclude_comments = /(\/\/.*)|(\/\*.*(\/)?)/g;//|([\"\'\`].*[\"\'\`])/g;
    rust.one_line_comment = /^[/]{2}/;
    rust.one_line_block = /.*\{.*\}.*/;
    rust.open_comment = /^\/\*/;
    rust.close_comment = /\*\/$/;
    const butterfly = /\}.*\{/;
    rust.open_block = /\{/g;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
    rust.close_block = /\}/g;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
    rust.tst_class = /^(trait(\<)?|struct(\<)?|(impl(\<)?)|enum(\<)?)|\s(trait(\<)?|struct(\<)?|(impl(\<)?)|enum(\<)?)/i;
    //let skip: skip_ln = new skip_ln();
    //skip.arr.push(/.*!/gi);
    for (let i = 0; i < lines.length; i++) {
        if (rust.one_line_comment7(i)) { continue; }
        if (rust.within_comment7(i)) { continue; }
        //if (skip.run(lines[i])) { continue; }
        if (rust.class_entry7(i)) { continue; }
        rust.head7(i);
        if (rust.one_line_block7(i)) { continue; }
        rust.block_entry7(i);
        if (rust.close_class7(i)) { continue; }
        //if (yea_class) { yea_class = false; continue; }
        rust.update_block_state(i);
        if (rust.close_block7(i)) { continue; }
    }
    symbols.push(...rust.symbols);
}
export function add_symb(
    startLine: number,
    endLine: number,
    objName: string,
    objType: string,
    uri: vscode.Uri,
    symbols: & vscode.SymbolInformation[]) {

    let set_rng = new vscode.Range(startLine, 0, endLine, 0);
    symbols.push(new vscode.SymbolInformation(
        objName,
        eval("vscode.SymbolKind." + objType),
        '',
        new vscode.Location(uri, set_rng)));
}
export class lang_element {
    #privateVar: number = 0;
    exclude_strns: RegExp = /(\"[\s\S]*?\")/gm;
    exclude_comments: RegExp = /(\/\/.*)|(\/\*.*(\/)?)/g;//|([\"\'\`].*[\"\'\`])/g;
    one_line_comment: RegExp = /^[/]{2}/;
    one_line_block: RegExp = /.*\{.*\}.*/;
    open_comment: RegExp = /^\/\*/;
    close_comment: RegExp = /(\*\/)$/;
    butterfly = /\}.*\{/;
    open_block: RegExp = /\{/g;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
    close_block: RegExp = /\}/g;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
    tst_class: RegExp = /.*(trait|struct|impl|enum)\s/i;
    #opened_class: number | null = null;
    #within_comment: boolean = false;
    #within_quotes = false
    #start_class: number | null = null;
    #start_block: number | null = null;
    #block_state: number = 0;
    #sav_block_state = 0;
    #fn_head: string = "";
    #search_curlies: RegExpMatchArray | null = null;
    #no_comments = "";
    #lines: string[] = [];
    #orig_lines: string[] = [];
    block_head: _block_head = new _block_head;
    rloc: number = 0;
    uri: vscode.Uri | null = vscode.window.activeTextEditor?.document.uri ?? null;
    symbols: vscode.SymbolInformation[] = [];
    class_symbols: vscode.SymbolInformation[] = [];
    set_lines(arr: string[], orig: string[]): boolean {
        if (this.uri == null) { return false; }
        this.#lines = arr;
        this.#orig_lines = orig;
        this.rloc = orig.length;
        return true;
    }
    one_line_comment7(lnum: number): boolean {
        return this.one_line_comment.test(this.#lines[lnum]);
    }
    within_comment7(lnum: number): boolean {
        if (!this.#within_comment) { this.#within_comment = this.open_comment.test(this.#lines[lnum].trim()); }
        if (this.#within_comment) {
            if (this.close_comment.test(this.#lines[lnum].trim())) {
                this.#within_comment = false;
                return true;
            }
        }
        return this.#within_comment;
    }
    class_entry7(i: number): boolean {
        if (this.#start_class != null && this.#opened_class == null && this.open_block.test(this.#lines[i])) {
            this.#opened_class = i;
            return true;
        }
        if (this.#start_class == null && this.#block_state == 0) {
            //let res = this.#lines[i].match(this.tst_class);
            //if (res != null) {
            if (this.tst_class.test(this.#lines[i])) {
                if (this.#lines[i].match(this.open_block) != null) {
                    //if (this.open_block.test(this.#lines[i])) {
                    this.#opened_class = i;
                }
                this.#start_class = i;
                this.#sav_block_state = this.#block_state;
            }
        }
        return this.#start_class === i || this.#opened_class === i;
    }
    block_entry7(i: number): boolean {
        //	this.head7(i);
        if (this.#start_block == null && this.#block_state == -1) {
            this.#fn_head = this.block_head.name;
            this.#start_block = i;
        }
        return this.#start_block === i
    }
    one_line_block7(i: number): boolean | undefined {
        if (this.uri == null) { return undefined }
        if (this.one_line_block.test(this.#lines[i]) && this.#block_state == 0 && this.block_head.name.length > 0) {
            add_symb(
                this.block_head.lnum,
                i,
                this.#orig_lines[i],
                "Function",
                this.uri,
                this.symbols
            );
            this.block_head.name = "";
            return true;
        }
        return false
    }
    head7(i: number) {
        this.#no_comments = this.#lines[i].replaceAll(this.exclude_comments, "");
        if (this.#block_state != 0) { return; }
        this.block_head.try_set_info(this.#no_comments, i);
    }
    close_block7(i: number): boolean | undefined {
        if (this.uri == null) { return undefined }
        if (this.#start_block != null && this.#block_state == 0 && this.block_head.name.length > 0) {
            add_symb(
                this.block_head.lnum,
                i + 1,
                this.#orig_lines[this.block_head.lnum],
                "Function",
                this.uri,
                this.symbols
            );
            this.block_head.name = "";
            this.#start_block = null;
            return true;
        }
        return false
    }
    close_class7(i: number): boolean | undefined {
        if (this.uri == null) { return undefined }
        if (this.#start_class != null && this.#opened_class != null && this.#block_state == 0 && this.close_block.test(this.#lines[i])) {
            add_symb(
                this.#start_class,
                i + 1,
                this.#orig_lines[this.#start_class],
                "Class",
                this.uri,
                this.symbols
            );
            this.block_head.name = "";
            this.#start_class = null;
            this.#opened_class = null;
            this.#opened_class = null
            return true;
        }
        return false
    }
    update_block_state(i: number) {
        //	this.#no_comments = this.#lines[i].replaceAll(this.exclude_comments, "");
        //	this.block_head.try_set_info(this.#no_comments, i);
        this.#block_state -= (this.#search_curlies = this.#no_comments.match(this.open_block)) != null ? this.#search_curlies.length : 0;
        if (!this.#opened_class && this.#start_class != null && this.#sav_block_state != this.#block_state) {
            this.#block_state += 1;
            this.#opened_class = i;
        }
        this.#block_state += (this.#search_curlies = this.#no_comments.match(this.close_block)) != null ? this.#search_curlies.length : 0;
    }
}
export function c_fn_body(doc: string, uri: vscode.Uri, symbols: & vscode.SymbolInformation[]) {
    let lines: string[] = doc.split("\n");
    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }
    const exclude_comments: RegExp = /(\/\/.*)|(\/\*.*(\/)?)/g;//|([\"\'\`].*[\"\'\`])/g;
    const one_line_comment: RegExp = /^[/]{2}/;
    const one_line_block: RegExp = /.*\{.*\}.*/;
    const open_comment: RegExp = /^\/\*/;
    const count_quotes: RegExp = /[\"\'\`]+/g;
    let quote_state: number = 0;
    let tmp_quote_state: number = 0;
    const close_comment: RegExp = /\*\/$/;
    const open_block: RegExp = /\{/;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
    const close_block: RegExp = /\}/;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
    const tst_class: RegExp = /.*(\sclass|\sstruct)\s/i;
    let opened_class = false;
    let within_comment: boolean = false;
    let within_quotes = false
    let start_class: number | null = null;
    let start_block: number | null = null;
    let block_state: number = 0;
    let sav_block_state = 0;
    let fn_head: string = "";
    let search_curlies: RegExpExecArray | null = null;
    let ln: string;
    let no_comments = "";
    let block_head = new _block_head;
    for (let i = 0; i < lines.length; i++) {
        ln = lines[i];
        if (one_line_comment.test(ln)) {
            continue;
        }
        if (!within_comment) { within_comment = open_comment.test(lines[i]); }
        if (within_comment) {
            if (close_comment.test(ln)) {
                within_comment = false;
            }
            continue;
        }
        if (quote_state == 0) { quote_state = count_quotes.exec(lines[i])?.length ?? 0; } // not complete covering
        if (quote_state > 0) {
            if ((tmp_quote_state = count_quotes.exec(lines[i])?.length ?? 0) > 0) {
                quote_state -= tmp_quote_state;
            }
            continue;
        }
        if (one_line_block.test(ln) && block_state == 0) {
            add_symb(
                i,
                i,
                ln,
                "Function",
                uri,
                symbols
            );
            continue;
        }
        if (one_line_block.test(ln) && block_state != 0) { continue; }
        if (start_class == null && block_state == 0) {
            if (tst_class.test(lines[i])) {
                if (open_block.test(lines[i])) { opened_class = true; }
                start_class = i;
                sav_block_state = block_state;
                continue;
            }
        }
        if (start_class != null && block_state == 0 && close_block.test(lines[i])) {
            add_symb(
                start_class,
                i,
                lines[start_class],
                "Class",
                uri,
                symbols
            );
            start_class = null;
            opened_class = false;
            continue;
        }
        no_comments = lines[i].replaceAll(exclude_comments, "");
        block_state -= (search_curlies = open_block.exec(no_comments)) != null ? search_curlies.length : 0;
        if (!opened_class && start_class != null && sav_block_state != block_state) {
            block_state += 1;
            opened_class = true;
        }
        block_state += (search_curlies = close_block.exec(no_comments)) != null ? search_curlies.length : 0;
        block_head.set_info(lines[i], i);
        if (start_block == null && block_state == -1) {
            fn_head = get_c_fn_head(lines, i);
            start_block = i;
        }
        if (start_block != null && block_state == 0) {
            add_symb(
                start_block,
                i,
                fn_head,
                "Function",
                uri,
                symbols
            );
            start_block = null;
        }
    }
}
export function get_c_fn_head(doc: string[], lnum: number): string {
    for (let i = lnum; i > -1; i--) {
        if (doc[i].includes("(")) { return doc[i]; }
    }
    return doc[0];
}
export class mode {
    static dbg: boolean = false;
}