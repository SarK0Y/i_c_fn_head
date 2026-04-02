// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AccessibilityInformation as wa } from 'vscode';
import { activate0 as colors } from './colorful';
import { extra_activate } from './colorful';
import { writeFileSync, readFileSync, copyFileSync, closeSync, existsSync, rmSync } from "fs";
import { menu } from "./quick_pick";
import { i_c_fn_head_opts } from './faav';
import {init } from './init'
export function activate11(context: vscode.ExtensionContext) {
	//eval(extra_activate());
	let tru = true;
	while (tru) {
		menu();
	}
	//return;
}
export async function activate(context: vscode.ExtensionContext) {
	//eval(extra_activate());
	let res = false;
	try {
		await init(context);
		res = sync_bkp.raw_writeBkp(i_c_fn_head_opts.path_to_conf, null, "/tmp/tst00");
		sync_bkp.raw_writeBkp("tst", null, "/tmp/tst0");
		console.log(res);
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
export function deactivate() { }

export function select_lang_n_tst_fn_head(): RegExp | null { //RegExpExecArray | null {
	const langId = vscode.window.activeTextEditor?.document.uri.fsPath ?? "";
	let regex = /rs$|c$|cpp$|d$/g;
	let lang: string = regex.exec(langId)?.[0] ?? "";
	const msg = "Active lang: " + langId?.toString();
	switch (lang) {
		case "c": { return c_cpp_d_head() }
		case "cpp": { return c_cpp_d_head() }
		case "d": { return c_cpp_d_head() }
		case "rs": { return rust_head() }
	}
	//	prnt(msg);
	return null
}

export function c_cpp_d_head(): RegExp {
	const regex: RegExp = /^[^+\-=]*\(/;//gm;
	return regex
}
export function rust_head(): RegExp {
	const regex: RegExp = /(^\s*(.*)?\s*fn\s+(\w+)\s*\(([^)]*)\)\s*(->\s*\w+)?\s*{?$)/m
	return regex;
}
export function prnt(msg: string) {
	const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
	outputChannel.appendLine(msg);
	outputChannel.show();
}
export function rebuild_doc(from: number, doc: string[]): string {
	let ret: string = "";
	for (let x = from; x < doc.length; x++) {
		ret += doc[x];
	}
	return ret;
}
export class skip_ln {
	arr: RegExp[] = []
	#ret: boolean = false;
	run(strn: string): boolean {
		this.#ret = false;
		for (let i = 0; i < this.arr.length; i++) {
			this.#ret = this.#ret || strn.match(this.arr[i]) != null;
		}
		return this.#ret;
	}
}
export function dont_clobbe_line_w_curly_bracket(txt: string | string[], uri: vscode.Uri) {
	if (sync_bkp.file_was_bkuped7(uri.fsPath)) { return; }
	let ret: string = "";
	let reformat = false;
	let _txt = typeof txt == "string" ? txt.split("\n") : txt; //???
	const one_line_comment: RegExp = /^[/]{2}/;
	const open_comment: RegExp = /^\/\*/;
	const close_comment: RegExp = /\*\/$/;
	let within_comment = false;
	let prev_strn = "";
	_txt.forEach(function (strn0: string) {
		let pad_len = count_spaces_from_left(strn0);
		let strn = strn0.trim();
		if (one_line_comment.test(strn)) {
			ret += strn + "\n";
			return;
		}
		if (!within_comment) { within_comment = open_comment.test(strn); }
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
		sync_bkp.writeBkp(
			ret,
			uri
		);
	}
}
export function count_spaces_from_left(strn: & string): number {
	for (let x = 0; x < strn.length; x++) {
		if (strn[x] != " ") { return x; }
	}
	return 0
}
export function exclude_comments_from_ln(ln0: & string): string {
	const one_line_comment: RegExp = /^[/]{2}/;
	const open_comment: RegExp = /^\/\*/;
	let ret = "";
	let pad_len = count_spaces_from_left(ln0);
	let ln: string | string[] = ln0.replaceAll("//", "<<>//").replaceAll("/*", "<<>\n/*");
	ln = ln.split("<<>");
	let open_curly = "";
	let close_curly = "";
	ln.forEach(function (strn: string) {
		if (!one_line_comment.test(strn) && !open_comment.test(strn)) {
			open_curly = "\n" + " ".repeat(pad_len) + "{";
			close_curly = "\n" + " ".repeat(pad_len) + "}";
			strn.replaceAll("{", open_curly).replaceAll("}", close_curly);
		}
		ret += " ".repeat(pad_len) + strn;
	});
	return ret;
}
export function pad_strn_from_left(strn: & string, pad_len: number, pad: string): string {
	let padding = "";
	for (let y = 0; y < pad_len; y++) {
		padding += pad;
	}
	return padding + strn;
}
class sync_bkp {
	static bkuped: string[] = [];
	static suffix: string = ".YourOriginalFile";
	static bkp_source_file(path0: vscode.Uri | string): boolean {
		let path = typeof path0 == "string" ? path0 : path0.fsPath;
		if (this.file_was_bkuped7(path)) { return true; }
		let new_name = path + this.suffix;
		copyFileSync(path, new_name);
		let ret = this.compare_files(path, new_name);
		if (ret) {
			this.bkuped.push(new_name);
		}
		return ret;
	}
	static file_was_bkuped7(path0: string): boolean {
		let path = path0 + this.suffix;
		if (this.bkuped.length == 0) { return false; }
		let ret: boolean = false;
		this.bkuped.forEach(function (strn: string, indx: number, arr: string[]) {
			if (strn == path) { ret = true; return; }
		});
		if (!ret) {
			if (existsSync(path)) {
				this.bkuped.push(path);
				return true;
			}
		}
		return ret;
	}
	static compare_files(_1st: string, _2nd: string): boolean {
		let open_1st: string = "";
		let open_2nd: string = "";
		try {
			open_1st = readFileSync(
				_1st,
				{ encoding: "utf-8", flag: "r" },
			);
		}
		catch (err) {
			let msg = "File: " + _1st + " got err: " + err + "\n";
			console.log(msg);
			return false;
		}
		try {
			open_2nd = readFileSync(
				_2nd,
				{ encoding: "utf-8", flag: "r" },
			);
		}
		catch (err) {
			let msg = "File: " + _2nd + " got err: " + err + "\n";
			console.log(msg);
			return false;
		}
		if (open_1st == open_2nd) { return true; }
		return false;
	}
	static writeBkp(data: string, uri?: vscode.Uri | null, path0?: string): boolean {
		let path: string = uri?.fsPath ?? path0 ?? "";
		if (path == "") { return false; }
		if (!this.bkp_source_file(path)) { return false; }
		writeFileSync(
			path,
			data
		);
		return true;
	}
	static raw_writeBkp(data: string, uri?: vscode.Uri | null, path0?: string): boolean {
		let path: string = uri?.fsPath ?? path0 ?? "";
		//if (path == "") { return false; }
		//if (!this.bkp_source_file(path)) { return false; }
		writeFileSync(
			path,
			data
		);
		return true;
	}
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