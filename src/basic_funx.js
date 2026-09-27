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
exports.sync_bkp = exports.exclude_uris = exports.cmd_rgx = exports.console_msg = void 0;
exports.prnt = prnt;
exports.getCMD = getCMD;
exports.exclude_paths = exclude_paths;
exports.msg_rank_2_strn = msg_rank_2_strn;
exports._msg_rank_2_strn = _msg_rank_2_strn;
exports.msg_mode = msg_mode;
const vscode = __importStar(require("vscode"));
const fs_stuff_1 = require("./fs_stuff");
const init_1 = require("./init");
const faav_1 = require("./faav");
const fs_1 = require("fs");
class set_cmd_type {
    static v = "rgx";
}
async function prnt(msg, rank) {
    if ((await msg_mode(rank ?? "info")) == false) {
        return;
    }
    let label = "[msg.info]";
    switch (rank) {
        case faav_1.rank_msg.dbg: {
            label = "[msg.dbg]";
            break;
        }
        case faav_1.rank_msg.err: {
            label = "[msg.err]";
            break;
        }
        case faav_1.rank_msg.warn: {
            label = "[msg.warn]";
            break;
        }
    }
    console_msg.show(label + ": " + msg);
}
class console_msg {
    static #outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    static show(msg) {
        this.#outputChannel.appendLine(msg);
        this.#outputChannel.show();
    }
}
exports.console_msg = console_msg;
async function getCMD(set_placeholder0, _txt, cmd_type) {
    const txt = _txt ? _txt : vscode.window.activeTextEditor?.document.getText();
    set_cmd_type.v = cmd_type ? cmd_type : set_cmd_type.v;
    cmd_rgx.set_collect_rgx_from_doc();
    if (txt == undefined) {
        return null;
    }
    const ret = set_placeholder0 ? await cmd_rgx._collect_rgx_from_doc(txt, set_placeholder0) : await cmd_rgx._collect_rgx_from_doc(txt);
    let phldr = set_placeholder0 ? set_placeholder0 : "no phldr";
    await prnt("calc num of cmds: " + ret.length.toString());
    // prnt (ewt)
    return ret;
}
class cmd_rgx {
    static collect_rgx_from_doc = /$^/; // rebuilt by set_collect_rgx_from_doc
    static placeholder0 = "@663@";
    static placeholder0_max_len = 200;
    static open_rgx = "/";
    static close_rgx = ":::";
    static async set_collect_rgx_from_doc(open_rgx, close_rgx) {
        this.open_rgx = open_rgx ?? this.open_rgx;
        this.close_rgx = close_rgx ?? this.close_rgx;
        let cmd_type = set_cmd_type.v ?? "rgx";
        let construct_rgx = "^[ \\t]*//[ \\t]*" + cmd_type + "[ \\t]*:[ \\t]*(" + this.open_rgx + ".*?(?:" + this.close_rgx + "[gmis]*)?)[ \\t]*//[ \\t\\r]*$";
        this.collect_rgx_from_doc = new RegExp(construct_rgx, "gm");
        await prnt("set_collect_rgx_from_doc: " + this.collect_rgx_from_doc.source);
        return this.collect_rgx_from_doc;
    }
    static async _collect_rgx_from_doc(txt, set_placeholder0) {
        if (set_placeholder0) {
            return this._collect_rgx_from_doc0(txt, set_placeholder0);
        }
        let m;
        let ret = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let try_it = await this.strn_2_rgx(m[1]);
            if (try_it == null) {
                await prnt("_collect_rgx_from_doc: try_it is null");
                break;
            }
            await prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static async _collect_rgx_from_doc0(txt, set_placeholder0) {
        let m;
        let ret = [];
        while ((m = this.collect_rgx_from_doc.exec(txt)) != null) {
            let _m = m[1].replaceAll(this.placeholder0, set_placeholder0);
            let try_it = await this.strn_2_rgx(_m);
            await prnt("1st class cmd_rgx");
            if (try_it == null) {
                await prnt("_collect_rgx_from_doc: try_it is null");
                break;
            }
            await prnt("_collect_rgx_from_doc:" + m[1]);
            ret.push(try_it);
        }
        return ret;
    }
    static async strn_2_rgx(strn) {
        let check_end_of_rgx = this.close_rgx + "[gmis]*$";
        let flags = strn.match(new RegExp(check_end_of_rgx));
        let _flags = flags != null ? flags[0].slice(this.close_rgx.length) : "";
        let regex = strn.slice(1).replaceAll(this.close_rgx + _flags, "");
        if (regex.length > 1 && regex.endsWith("/")) {
            regex = regex.slice(0, regex.length - 1);
        }
        try {
            let ret = new RegExp(regex, _flags);
            await prnt("strn to rgx: " + ret.source + " " + ret.flags);
            return ret;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            vscode.window.showInformationMessage(msg);
            return null;
        }
    }
}
exports.cmd_rgx = cmd_rgx;
async function exclude_paths(uris) {
    try {
        exclude_uris.v = uris;
        const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        prnt(txt);
        let exclude_paths0 = await getCMD(null, txt, "exclude_path");
        if (exclude_paths0 == null) {
            return;
        }
        for (let exc of exclude_paths0) {
            await exclude_path(exc);
        }
        return exclude_uris.v;
    }
    catch (err) {
        await prnt("exclude path: " + String(err), faav_1.rank_msg.err);
        return;
    }
}
async function exclude_path(rgx) {
    for (let i = 0; i < exclude_uris.v.length; i++) {
        await prnt(rgx.source);
        exclude_uris.s[i] = exclude_uris.v[i].fsPath.trim();
        if (exclude_uris.s[i].match(rgx) != null) {
            await prnt(exclude_uris.s[i]);
            exclude_uris.s.splice(i, 1);
            exclude_uris.v.splice(i, 1);
        }
    }
}
async function exclude_path1(uris, rgx) {
    let ret = [];
    for (let uri of uris) {
        await prnt(rgx.source);
        if (uri.fsPath.match(rgx) == null) {
            ret.push(uri);
        }
    }
    return ret;
}
function msg_rank_2_strn(rank) {
    let label = "info";
    switch (rank) {
        case faav_1.rank_msg.dbg: {
            label = "[msg.dbg]";
            break;
        }
        case faav_1.rank_msg.err: {
            label = "[msg.err]";
            break;
        }
        case faav_1.rank_msg.warn: {
            label = "[msg.warn]";
            break;
        }
    }
    return label;
}
function _msg_rank_2_strn(rank) {
    let label = "info";
    switch (rank) {
        case faav_1.rank_msg.dbg: {
            label = "dbg";
            break;
        }
        case faav_1.rank_msg.err: {
            label = "err";
            break;
        }
        case faav_1.rank_msg.warn: {
            label = "warn]";
            break;
        }
    }
    return label;
}
async function msg_mode(rank) {
    let mode = typeof rank == "string" ? rank : _msg_rank_2_strn(rank);
    try {
        const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        if ((0, init_1.msg_opt)("all").test(txt)) {
            return true;
        }
        if ((0, init_1.msg_opt)(mode).test(txt)) {
            return true;
        }
        return false;
    }
    catch (err) {
        await prnt("msg mode: " + String(err), faav_1.rank_msg.err);
        return false;
    }
}
class exclude_uris {
    static v = [];
    static s = [];
}
exports.exclude_uris = exclude_uris;
class sync_bkp {
    static bkuped = [];
    static suffix = ".YourOriginalFile";
    static bkp_source_file(path0) {
        let path = typeof path0 == "string" ? path0 : path0.fsPath;
        if (this.file_was_bkuped7(path)) {
            return true;
        }
        let new_name = path + this.suffix;
        (0, fs_1.copyFileSync)(path, new_name);
        let ret = this.compare_files(path, new_name);
        if (ret) {
            this.bkuped.push(new_name);
        }
        return ret;
    }
    static file_was_bkuped7(path0) {
        let path = path0 + this.suffix;
        if (this.bkuped.length == 0) {
            return false;
        }
        let ret = false;
        this.bkuped.forEach(function (strn, indx, arr) {
            if (strn == path) {
                ret = true;
                return;
            }
        });
        if (!ret) {
            if ((0, fs_1.existsSync)(path)) {
                this.bkuped.push(path);
                return true;
            }
        }
        return ret;
    }
    static compare_files(_1st, _2nd) {
        let open_1st = "";
        let open_2nd = "";
        try {
            open_1st = (0, fs_1.readFileSync)(_1st, { encoding: "utf-8", flag: "r" });
        }
        catch (err) {
            let msg = "File: " + _1st + " got err: " + err + "\n";
            console.log(msg);
            return false;
        }
        try {
            open_2nd = (0, fs_1.readFileSync)(_2nd, { encoding: "utf-8", flag: "r" });
        }
        catch (err) {
            let msg = "File: " + _2nd + " got err: " + err + "\n";
            console.log(msg);
            return false;
        }
        if (open_1st == open_2nd) {
            return true;
        }
        return false;
    }
    static writeBkp(data, uri, path0) {
        let path = uri?.fsPath ?? path0 ?? "";
        if (path == "") {
            return false;
        }
        if (!this.bkp_source_file(path)) {
            return false;
        }
        (0, fs_1.writeFileSync)(path, data);
        return true;
    }
    static raw_writeBkp(data, uri, path0) {
        let path = uri?.fsPath ?? path0 ?? "";
        //if (path == "") { return false; }
        //if (!this.bkp_source_file(path)) { return false; }
        (0, fs_1.writeFileSync)(path, data);
        return true;
    }
    static raw_appendBkp(data, uri, path0) {
        let path = uri?.fsPath ?? path0 ?? "";
        //if (path == "") { return false; }
        //if (!this.bkp_source_file(path)) { return false; }
        (0, fs_1.appendFileSync)(path, data);
        return true;
    }
}
exports.sync_bkp = sync_bkp;
//# sourceMappingURL=basic_funx.js.map