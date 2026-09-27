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
exports.F12_action = void 0;
exports.new_EL = new_EL;
exports.new_pressF12 = new_pressF12;
exports.handleExtraCMDs = handleExtraCMDs;
exports._a_get_files_in_workspace = _a_get_files_in_workspace;
const vscode = __importStar(require("vscode"));
const faav_1 = require("./faav");
const basic_funx_1 = require("./basic_funx");
const faav_2 = require("./faav");
const fs_stuff_1 = require("./fs_stuff");
var F12_action;
(function (F12_action) {
    F12_action[F12_action["cont"] = 0] = "cont";
    F12_action[F12_action["stop"] = 1] = "stop";
})(F12_action || (exports.F12_action = F12_action = {}));
function new_EL(v) {
    let ret = v ? v : [];
    return { kind: "extra_locations", v: ret };
}
function new_pressF12(v) {
    let ret = v ? v : F12_action.cont;
    return { kind: "F12_action", v: ret };
}
async function handleExtraCMDs(set_placeholder0) {
    try {
        let cmds = set_placeholder0 ? await (0, basic_funx_1.getCMD)(set_placeholder0, null, "rgx") : await (0, basic_funx_1.getCMD)(null, null, "rgx");
        let f12 = new_pressF12();
        if (cmds == null) {
            f12.v = F12_action.cont;
            return f12;
        }
        let more_rgxs = await handle_rgx_cmd(cmds);
        if (more_rgxs.length > 0) {
            return new_EL(more_rgxs);
        }
        await (0, basic_funx_1.prnt)("failed to collect extra locations");
    }
    catch (error) {
        await (0, basic_funx_1.prnt)("handleExtraCMDs: " + String(error), faav_1.rank_msg.err);
    }
    return new_pressF12(F12_action.cont);
}
async function handle_rgx_cmd(cmds) {
    const res = [];
    let matches;
    basic_funx_1.exclude_uris.v = await _a_get_files_in_workspace();
    await (0, basic_funx_1.prnt)("uris number: " + basic_funx_1.exclude_uris.v.length, faav_1.rank_msg.dbg);
    await (0, basic_funx_1.exclude_paths)(basic_funx_1.exclude_uris.v);
    await (0, basic_funx_1.prnt)("num of pruned uris: " + basic_funx_1.exclude_uris.v.length, faav_1.rank_msg.dbg);
    let uri;
    for (uri of basic_funx_1.exclude_uris.v) {
        try {
            let doc = await vscode.workspace.openTextDocument(uri);
            if (doc == undefined) {
                await (0, basic_funx_1.prnt)("failed to open " + uri);
                continue;
            }
            let txt = doc.getText();
            for (let rgx of cmds) {
                matches = txt.matchAll(rgx);
                if (matches == null) {
                    continue;
                }
                res.push(...calc_locations(matches, doc));
            }
        }
        catch (error) {
            await (0, basic_funx_1.prnt)("doc: " + uri.fsPath + "err " + String(error), faav_1.rank_msg.err);
        }
    }
    return res;
}
function calc_locations(matches, doc) {
    let res = [];
    let Start = new vscode.Position(0, 0);
    let End = new vscode.Position(0, 0);
    let _1st_ch_indx = 0;
    let txt = doc.getText();
    let uri = doc.uri;
    for (let m of matches) {
        let len = m[0].length;
        _1st_ch_indx = txt.indexOf(m[0], _1st_ch_indx + 1);
        if (_1st_ch_indx == -1) {
            break;
        }
        Start = doc.positionAt(_1st_ch_indx);
        End = doc.positionAt(_1st_ch_indx + len);
        res.push(new vscode.Location(uri, new vscode.Range(Start, End)));
    }
    return res;
}
function cursorPos() {
    const editor = vscode.window.activeTextEditor;
    if (!editor)
        return null;
    const pos = editor.selection.active;
    // const line = pos.line;
    // const col = pos.character;
    return pos;
}
async function _a_get_files_in_workspace() {
    let pre_ret = [];
    let _include_dirs = await (0, fs_stuff_1.include_dirs)();
    if (_include_dirs.length > 0) {
        pre_ret.push(..._include_dirs);
    }
    (0, basic_funx_1.prnt)("pre_ret: " + pre_ret.length, faav_1.rank_msg.dbg);
    let _collect_subdirs = await (0, fs_stuff_1.collect_subdirs)();
    if (_collect_subdirs.length > 0) {
        pre_ret.push(..._collect_subdirs);
    }
    pre_ret = Array.from(new Set(pre_ret));
    if (pre_ret.length > 0) {
        return pre_ret;
    }
    const file_of_opts = await (0, fs_stuff_1.uri_to_file_of_opts)();
    const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
    faav_2.restrict_search.exclude_paths = "**/(" + (await (0, basic_funx_1.getCMD)(null, txt, "exclude_path"))?.[0].source + ")/*";
    let file_ext = "";
    let uris = [];
    let file_exts = (await (0, faav_2.langsName)()).file_exts;
    if (file_exts.length > 0) {
        for (let i = 0; i < file_exts.length; i++) {
            file_ext = "**/*." + file_exts[i];
            await (0, basic_funx_1.prnt)('update file_ext ' + file_ext);
            let uri = await vscode.workspace.findFiles(
            //   '**/*.{langsName.file_exts}',
            file_ext, "", //restrict_search.exclude_paths,
            faav_2.restrict_search.max_num_of_res);
            uris.push(...uri);
        }
    }
    return uris;
}
/*
function handleChangeSel(event: vscode.TextEditorSelectionChangeEvent) {
    console.log("Change in the text editor");
    for (var i = 0; i < event.selections.length; i++) {
        var selection = event.selections[i];
        console.log("Start- Line: (" + selection.start.line + ") Col: (" + selection.start.character + ") End- Line: (" + selection.end.line + ") Col: (" + selection.end.character + ")");
    }
    var scroll = vscode.workspace.getConfiguration("editorScroll");
    console.log(event);
    var doc: vscode.TextDocument = vscode.workspace.textDocuments[0];
    let msg = "status bar: " + doc.getText();
    console.log(msg);
}
vscode.window.onDidChangeTextEditorSelection(handleChangeSel);
*/ 
//# sourceMappingURL=fancy_f12.js.map