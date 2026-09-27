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
exports.include_subdirs = include_subdirs;
exports.collect_subdirs = collect_subdirs;
exports.JavaHome = JavaHome;
exports.Jar = Jar;
exports.include_dirs = include_dirs;
exports.collect_dirs = collect_dirs;
exports.include_dir = include_dir;
exports.uri_to_file_of_opts = uri_to_file_of_opts;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const faav_1 = require("./faav");
const basic_funx_1 = require("./basic_funx");
const util_1 = require("util");
const basic_funx_2 = require("./basic_funx");
const _readdir = (0, util_1.promisify)(fs.readdir);
async function include_subdirs() {
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        (0, basic_funx_1.prnt)("include_subdirs: " + txt, faav_1.rank_msg.dbg);
        let tst = "//include_subdirs:\\s*" + basic_funx_1.cmd_rgx.open_rgx + "(\\/[a-zA-Z/_\.0-9\-\*]+)" + "\\s*" + basic_funx_1.cmd_rgx.close_rgx + "//";
        let rgx = RegExp(tst, "g");
        (0, basic_funx_1.prnt)("include_subdirs: " + rgx.source, faav_1.rank_msg.dbg);
        let collect_includes = txt.matchAll(rgx);
        let ret = [];
        for (let m of collect_includes) {
            (0, basic_funx_1.prnt)("include_subdirs: " + m[1], faav_1.rank_msg.dbg);
            ret.push(m[1]);
        }
        return ret;
    }
    catch (err) {
        await (0, basic_funx_1.prnt)("include_subdirs: " + String(err), faav_1.rank_msg.err);
    }
    return [];
}
async function collect_subdirs() {
    let paths = await include_subdirs();
    let ret = [];
    for (let p of paths) {
        let find = await vscode.workspace.findFiles(new vscode.RelativePattern(vscode.Uri.file(p), '**/*'), "" /* exclude none path */
        /* only one result */
        );
        if (find) {
            (0, basic_funx_1.prnt)("collect_subdirs: " + find.toString(), faav_1.rank_msg.dbg);
            ret.push(...find);
        }
    }
    return ret;
}
async function JavaHome() {
    if (faav_1.jHome.jh != "") {
        return faav_1.jHome.jh;
    }
    let fn_name = "jHome";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        (0, basic_funx_1.prnt)(fn_name + ": " + txt, faav_1.rank_msg.dbg);
        let tst = "//\\s*" + fn_name.slice(0, fn_name.length) + ":\\s*" + "(\\/[a-zA-Z/_\.0-9\-\*]+)" + "\\s*" + basic_funx_1.cmd_rgx.close_rgx + "//";
        let rgx = RegExp(tst, "g");
        (0, basic_funx_1.prnt)(fn_name + ": " + rgx.source, faav_1.rank_msg.dbg);
        let jhome = txt.matchAll(rgx);
        basic_funx_2.sync_bkp.raw_writeBkp(jhome.toString(), null, "/tmp/jar");
        let _jhome = "";
        for (let m of jhome) {
            basic_funx_2.sync_bkp.raw_appendBkp(m[0], null, "/tmp/jar");
            basic_funx_2.sync_bkp.raw_appendBkp(m[1], null, "/tmp/jar");
            if (m[1] != "") {
                _jhome = m[1];
            }
        }
        faav_1.jHome.jh = jhome == null ? "" : _jhome;
        return faav_1.jHome.jh;
    }
    catch (err) {
        await (0, basic_funx_1.prnt)(fn_name + ": " + String(err), faav_1.rank_msg.err);
    }
    return "";
}
async function Jar() {
    if (faav_1.jHome.j != "") {
        return faav_1.jHome.j;
    }
    let fn_name = "Jar";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        (0, basic_funx_1.prnt)(fn_name + ": " + txt, faav_1.rank_msg.dbg);
        let tst = "//\\s*" + fn_name.slice(0, fn_name.length) + ":\\s*" + "(\\/[a-zA-Z/_\.0-9\-\*]+)" + "\\s*" + basic_funx_1.cmd_rgx.close_rgx + "//";
        let rgx = RegExp(tst, "g");
        basic_funx_2.sync_bkp.raw_writeBkp(rgx.source, null, "/tmp/rgx");
        (0, basic_funx_1.prnt)(fn_name + ": " + rgx.source, faav_1.rank_msg.dbg);
        let jar = txt.matchAll(rgx);
        basic_funx_2.sync_bkp.raw_writeBkp(jar.toString(), null, "/tmp/jar");
        let _jar = "";
        for (let m of jar) {
            basic_funx_2.sync_bkp.raw_appendBkp(m[0], null, "/tmp/jar");
            basic_funx_2.sync_bkp.raw_appendBkp(m[1], null, "/tmp/jar");
            if (m[1] != "") {
                _jar = m[1];
            }
        }
        faav_1.jHome.j = jar == null ? "" : _jar;
        return faav_1.jHome.j;
    }
    catch (err) {
        await (0, basic_funx_1.prnt)(fn_name + ": " + String(err), faav_1.rank_msg.err);
    }
    return "";
}
async function include_dirs() {
    let fn_name = "include_dirs";
    try {
        const file_of_opts = await uri_to_file_of_opts();
        const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
        (0, basic_funx_1.prnt)(fn_name + ": " + txt, faav_1.rank_msg.dbg);
        let tst = "//\\s*" + fn_name.slice(0, fn_name.length - 1) + ":\\s*" + basic_funx_1.cmd_rgx.open_rgx + "(\\/[a-zA-Z/_\.0-9\-\*]+)" + "\\s*" + basic_funx_1.cmd_rgx.close_rgx + "//";
        let rgx = RegExp(tst, "g");
        (0, basic_funx_1.prnt)(fn_name + ": " + rgx.source, faav_1.rank_msg.dbg);
        let collect_includes = txt.matchAll(rgx);
        let paths = [];
        for (let m of collect_includes) {
            (0, basic_funx_1.prnt)(fn_name + ": " + m[1], faav_1.rank_msg.dbg);
            paths.push(m[1]);
        }
        return collect_dirs(paths);
    }
    catch (err) {
        await (0, basic_funx_1.prnt)(fn_name + ": " + String(err), faav_1.rank_msg.err);
    }
    return [];
}
async function collect_dirs(paths) {
    let ret = [];
    let uris = [];
    for (let p of paths) {
        (0, basic_funx_1.prnt)("collect_dirs: " + p, faav_1.rank_msg.dbg);
        uris.push(...await include_dir(p));
        (0, basic_funx_1.prnt)("collect_dirs: " + uris.length, faav_1.rank_msg.dbg);
        if (uris.length > 0) {
            ret.push(...uris);
        }
    }
    return ret;
}
async function include_dir(dir) {
    let ret = [];
    try {
        const entries = await _readdir(dir, { withFileTypes: true });
        let x = entries
            .filter(e => e.isFile())
            .map(e => vscode.Uri.file(path.join(dir, e.name)));
        ret.push(...x);
    }
    catch (err) {
        (0, basic_funx_1.prnt)("include_dir: " + String(err), faav_1.rank_msg.err);
        return [];
    }
    (0, basic_funx_1.prnt)("include_dir: " + "ret len: " + ret.length, faav_1.rank_msg.dbg);
    return ret;
}
async function uri_to_file_of_opts() {
    return vscode.workspace.findFiles('**/i_c_fn_head.opts', "", /* exclude none path */ 1 /* only one result */);
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
//# sourceMappingURL=fs_stuff.js.map