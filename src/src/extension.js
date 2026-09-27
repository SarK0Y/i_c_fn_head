"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.skip_ln = void 0;
exports.activate11 = activate11;
exports.activate = activate;
exports.deactivate = deactivate;
exports.select_lang_n_tst_fn_head = select_lang_n_tst_fn_head;
exports.c_cpp_d_head = c_cpp_d_head;
exports.rust_head = rust_head;
exports.rebuild_doc = rebuild_doc;
exports.dont_clobbe_line_w_curly_bracket = dont_clobbe_line_w_curly_bracket;
exports.count_spaces_from_left = count_spaces_from_left;
exports.exclude_comments_from_ln = exclude_comments_from_ln;
exports.pad_strn_from_left = pad_strn_from_left;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const quick_pick_1 = require("./quick_pick");
const faav_1 = require("./faav");
const init_1 = require("./init");
const basic_funx_1 = require("./basic_funx");
function activate11(context) {
    //eval(extra_activate());
    let tru = true;
    while (tru) {
        (0, quick_pick_1.menu)();
    }
    //return;
}
async function activate(context) {
    //eval(extra_activate());
    let res = false;
    try {
        res = basic_funx_1.sync_bkp.raw_writeBkp(faav_1.i_c_fn_head_opts.path_to_conf, null, "/tmp/tst00");
        //	sync_bkp.raw_writeBkp("tst", null, "/tmp/tst0");
        //		vscode.window.showInformationMessage(res.toString());
        //		console.log(res.toString());
        await (0, init_1.init)(context);
        //		console.log(res.toString());
    }
    catch {
        console.error("err");
    }
    const disposable = vscode.commands.registerCommand('i-c-fn-head.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from i_c_fn_head!');
    });
    context.subscriptions.push(disposable);
    const disposable0 = vscode.commands.registerCommand('extension.onUpArrowPress', () => {
        vscode.window.showInformationMessage('up Key Press Detected!');
    });
    context.subscriptions.push(disposable0);
    //	vscode.window.onDidChangeTextEditorSelection(handleChangeSel);
    /*	const disposable1 = vscode.commands.registerCommand('extension.getCursorPosition', () => {
            const editor = vscode.window.activeTextEditor;
    
    /*		if (editor) {
                const cursorPosition = editor.selection.active; // Get the active cursor position
                console.log('Cursor Position:', cursorPosition); // Log the position
                vscode.window.showInformationMessage(`Cursor Position: Line ${cursorPosition.line + 1}, Character ${cursorPosition.character + 1}`);
            } else {
                vscode.window.showInformationMessage('No active editor found.');
            }
        });
    
        context.subscriptions.push(disposable1); */
}
// This method is called when your extension is deactivated
function deactivate() { }
function select_lang_n_tst_fn_head() {
    const langId = vscode.window.activeTextEditor?.document.uri.fsPath ?? "";
    let regex = /rs$|c$|cpp$|d$/g;
    let lang = regex.exec(langId)?.[0] ?? "";
    const msg = "Active lang: " + langId?.toString();
    switch (lang) {
        case "c": {
            return c_cpp_d_head();
        }
        case "cpp": {
            return c_cpp_d_head();
        }
        case "d": {
            return c_cpp_d_head();
        }
        case "rs": {
            return rust_head();
        }
    }
    //	prnt(msg);
    return null;
}
function c_cpp_d_head() {
    const regex = /^[^+\-=]*\(/; //gm;
    return regex;
}
function rust_head() {
    const regex = /(^\s*(.*)?\s*fn\s+(\w+)\s*\(([^)]*)\)\s*(->\s*\w+)?\s*{?$)/m;
    return regex;
}
function rebuild_doc(from, doc) {
    let ret = "";
    for (let x = from; x < doc.length; x++) {
        ret += doc[x];
    }
    return ret;
}
class skip_ln {
    arr = [];
    #ret = false;
    run(strn) {
        this.#ret = false;
        for (let i = 0; i < this.arr.length; i++) {
            this.#ret = this.#ret || strn.match(this.arr[i]) != null;
        }
        return this.#ret;
    }
}
exports.skip_ln = skip_ln;
function dont_clobbe_line_w_curly_bracket(txt, uri) {
    if (basic_funx_1.sync_bkp.file_was_bkuped7(uri.fsPath)) {
        return;
    }
    let ret = "";
    let reformat = false;
    let _txt = typeof txt == "string" ? txt.split("\n") : txt; //???
    const one_line_comment = /^[/]{2}/;
    const open_comment = /^\/\*/;
    const close_comment = /\*\/$/;
    let within_comment = false;
    let prev_strn = "";
    _txt.forEach(function (strn0) {
        let pad_len = count_spaces_from_left(strn0);
        let strn = strn0.trim();
        if (one_line_comment.test(strn)) {
            ret += strn + "\n";
            return;
        }
        if (!within_comment) {
            within_comment = open_comment.test(strn);
        }
        if (within_comment) {
            if (close_comment.test(strn)) {
                within_comment = false;
            }
            ret += strn + "\n";
            return;
        }
        /*if (strn[0] == "{" && strn.length > 1) {
            strn = "{" + "\n" + strn.substring(1);
            reformat = true;
        }
        if (strn.charAt(strn.length - 1) == "}" && strn.length > 1) {
            strn = strn.substring(0, strn.length - 1) + "\n" + "}";
            reformat = true;
        }*/
        prev_strn = strn;
        strn = exclude_comments_from_ln(strn);
        if (strn.length != prev_strn.length) {
            reformat = true;
            ret += "\n" + strn;
            return;
        }
        if (strn.length > 0) {
            ret += "\n" + pad_strn_from_left(strn, pad_len, " ");
        }
    });
    if (reformat) {
        basic_funx_1.sync_bkp.writeBkp(ret, uri);
    }
}
function count_spaces_from_left(strn) {
    for (let x = 0; x < strn.length; x++) {
        if (strn[x] != " ") {
            return x;
        }
    }
    return 0;
}
function exclude_comments_from_ln(ln0) {
    const one_line_comment = /^[/]{2}/;
    const open_comment = /^\/\*/;
    let ret = "";
    let pad_len = count_spaces_from_left(ln0);
    let ln = ln0.replaceAll("//", "<<>//").replaceAll("/*", "<<>\n/*");
    ln = ln.split("<<>");
    let open_curly = "";
    let close_curly = "";
    ln.forEach(function (strn) {
        if (!one_line_comment.test(strn) && !open_comment.test(strn)) {
            open_curly = "\n" + " ".repeat(pad_len) + "{";
            close_curly = "\n" + " ".repeat(pad_len) + "}";
            strn.replaceAll("{", open_curly).replaceAll("}", close_curly);
        }
        ret += " ".repeat(pad_len) + strn;
    });
    return ret;
}
function pad_strn_from_left(strn, pad_len, pad) {
    let padding = "";
    for (let y = 0; y < pad_len; y++) {
        padding += pad;
    }
    return padding + strn;
}
//fn
/*
>>>>>>>>>>>>>>>>>>>>>>>>> copag
 https://drive.google.com/file/d/15tU9cVEKlcbelByGuzo7UrZd32ckruUZ/view?usp=sharing
 https://disk.yandex.ru/d/DCedGk0BJB9YOw
 >>>>>>>>>>>>>>>>>>>>>>> BKP
 https://disk.yandex.ru/d/H-WL_Rbq3F3DtB
 https://disk.yandex.ru/d/06mg7S_1sEcQwQ
  https://drive.google.com/file/d/1gQ4iW7uc5e9dd3lQcZ146Izy6hZI87He/view?usp=sharing
 https://drive.google.com/file/d/0B0ZfQGOhsgRtbWQ2bkh6VFdCY2M/view?usp=sharing&resourcekey=0-qWG1G78Mp0KhxW_b9-0FnA
 https://disk.yandex.ru/d/457kWno9UEXZxQ
 https://drive.google.com/file/d/1kGDzmRraRZBTgs3mnnHWlC6aUGsppSjb/view?usp=sharing
*/
// https://github.com/JatinSanghvi/color-my-text-vscode/blob/main/src/extension.ts
//# sourceMappingURL=extension.js.map