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
exports.kwFile = exports.jHome = exports.rank_msg = exports._block_head = exports.i_c_fn_head_opts = exports.restrict_search = void 0;
exports.langsName1 = langsName1;
exports.langsName = langsName;
exports.lang_sel = lang_sel;
exports.doc_sel = doc_sel;
const vsc = __importStar(require("vscode"));
const basic_funx_1 = require("./basic_funx");
const path = __importStar(require("path"));
async function langsName1() {
    let doc = vsc.window.activeTextEditor?.document;
    let langId = doc?.languageId;
    await (0, basic_funx_1.prnt)("langsName(): " + langId + " " + doc?.uri, rank_msg.dbg);
    if (langId == undefined) {
        return { name: "", file_exts: [] };
    }
    switch (langId.toLowerCase()) {
        case "c": {
            return { name: "C", file_exts: ["c", "h"] };
        }
        case "d": {
            return { name: "D", file_exts: ["d"] };
        }
        case "rust": {
            return { name: "Rust", file_exts: ["rs"] };
        }
        case "cpp": {
            return { name: "CPP", file_exts: ["cpp", "hpp", "h"] };
        }
        default: {
            return { name: "", file_exts: [] };
        }
    }
}
async function langsName() {
    const langId = path.extname(vsc.window.activeTextEditor?.document.uri.fsPath || ''); //.slice(1);
    let regex = /rs$|c$|cpp$|d$/g;
    let lang = regex.exec(langId)?.[0] ?? "";
    const msg = "Active lang: " + langId?.toString();
    await (0, basic_funx_1.prnt)("langsName(): " + lang, rank_msg.dbg);
    if (langId == undefined) {
        return { name: "", file_exts: [] };
    }
    switch (lang) {
        case "c": {
            return { name: "C", file_exts: ["c", "h"] };
        }
        case "d": {
            return { name: "D", file_exts: ["d"] };
        }
        case "rs": {
            return { name: "Rust", file_exts: ["rs"] };
        }
        case "cpp": {
            return { name: "CPP", file_exts: ["cpp", "hpp", "h"] };
        }
        default: {
            return { name: "", file_exts: [] };
        }
    }
}
class restrict_search {
    static max_num_of_res = 2000;
    static exclude_paths = "**/(tests|build)/**";
}
exports.restrict_search = restrict_search;
class i_c_fn_head_opts {
    static path_to_conf = "";
    static been_set = false;
    static provide_lang_C = false;
    static provide_lang_CPP = false;
    static provide_lang_D = false;
    static provide_lang_Rust = false;
    static provide_lang_Java = false;
}
exports.i_c_fn_head_opts = i_c_fn_head_opts;
function lang_sel() {
    let sel = [];
    if (i_c_fn_head_opts.provide_lang_C) {
        sel.push('c');
    }
    if (i_c_fn_head_opts.provide_lang_Rust) {
        sel.push('rust');
    }
    if (i_c_fn_head_opts.provide_lang_CPP) {
        sel.push('cpp');
    }
    if (i_c_fn_head_opts.provide_lang_D) {
        sel.push('d');
    }
    if (i_c_fn_head_opts.provide_lang_Java) {
        sel.push('java');
    }
    return sel;
}
function doc_sel() {
    return lang_sel().map(lang => ({ scheme: 'file', language: lang }));
}
class _block_head {
    name = "";
    lnum = 0;
    mark_fn_head = /(fn\s.*\{?)|(\sfn\s.*\{?)/;
    set_info(strn, i, fn_head) {
        if (strn.length <= 1) {
            return;
        }
        this.name = strn;
        this.lnum = i;
        this.mark_fn_head = fn_head ?? this.mark_fn_head;
    }
    get_head(name7, i) {
        let _name7 = name7.trim();
        if (this.mark_fn_head.test(_name7)) {
            return _name7;
        }
        return this.name;
    }
    try_set_info(strn, i) {
        if (strn.length <= 1) {
            return;
        }
        let tst = this.mark_fn_head.test(strn);
        if (!tst) {
            return;
        }
        this.name = strn;
        this.lnum = i;
    }
}
exports._block_head = _block_head;
var rank_msg;
(function (rank_msg) {
    rank_msg[rank_msg["info"] = 0] = "info";
    rank_msg[rank_msg["warn"] = 1] = "warn";
    rank_msg[rank_msg["err"] = 2] = "err";
    rank_msg[rank_msg["dbg"] = 3] = "dbg";
})(rank_msg || (exports.rank_msg = rank_msg = {}));
class jHome {
    static jh = "";
    static j = "";
}
exports.jHome = jHome;
class kwFile {
    static files = new Map();
}
exports.kwFile = kwFile;
//# sourceMappingURL=faav.js.map