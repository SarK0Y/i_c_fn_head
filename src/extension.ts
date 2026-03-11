// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AccessibilityInformation as wa } from 'vscode';
import { writeFileSync, readFileSync, copyFileSync, closeSync, existsSync, rmSync } from "fs";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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
export function activate(context: vscode.ExtensionContext) {

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
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider({ language: 'Rust' }, new ShowDocumentSymbols())
	);
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider({ language: 'D' }, new ShowDocumentSymbols())
	);
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider({ language: 'C' }, new ShowDocumentSymbols())
	);
	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider({ language: 'CPP' }, new ShowDocumentSymbols())
	);
	vscode.window.onDidChangeTextEditorSelection(handleChangeSel);
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
class ShowDocumentSymbols implements vscode.DocumentSymbolProvider {
	provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
		const symbols: vscode.SymbolInformation[] = [];
		let text0 = document.getText();
		const text = text0.split("\n");

		// Regular expression patterns for different symbols
		const functionPattern: RegExp[] = [
			/(^(\s*if))/g,
		];
		const classPattern = /class\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
		const variablePattern = /const\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|let\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|var\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
		let wrong_ending = /;[\s]*}?$/
		const func_ret = /^return\s/;
		const while_op = /[\s]*while[\s]*\(/;
		const for_op = /\s*for[\s]*\(?/;
		const switch_op = /[\s]*switch[\s]*\(?/;
		const if_op = /^[\s]*if[\s]*\(/;
		const scope_op_in_D = /^scope\s*\(/;
		const bad_symbs = /[=+\-]/;
		// Extract functions
		let match: RegExpExecArray | null | undefined = null;
		//console.log("start");
		//console.log(text);
		let yes_D = vscode.window.activeTextEditor?.document.languageId.toLowerCase() === "d";
		let functionName: string = "";
		let _1st: boolean = true;
		let line: number = 0;
		let pos: vscode.Range | undefined = new vscode.Range(0, 0, 0, 100);
		let point: vscode.Position = new vscode.Position(0, 0);
		let set_rng: vscode.Range;
		let default_range = new vscode.Range(0, 0, 0, 100);
	/*	while ((match = select_lang_n_tst_fn_head (text0) ) !== null) {
			const fnName = match[1];
			const position = document.positionAt(match.index);
			symbols.push(new vscode.SymbolInformation(fnName, vscode.SymbolKind.Function, '', new vscode.Location(document.uri, position)));
		}*/
		//dont_clobbe_line_w_curly_bracket(text0, document.uri);
	//	if (manage_output(text0, document.uri, symbols) != _manage_output.Rust) { return symbols; }
		manage_output(text0, document.uri, symbols);
		return symbols;
		let regex = select_lang_n_tst_fn_head();
		text.forEach(function (strn: string) {
			let strn0 = strn.trim();
			//let _bad_symbs = bad_symbs.test(strn0) || strn0.charAt(strn.length - 1) === ";";
			//text0 = rebuild_doc(line, text);
			match = regex?.exec(strn0);
			let _1st_line_of_match: string = strn0; //match?.[0].split(/\s+/)[0] ?? "";
			let wrong_line: boolean = wrong_ending.test(_1st_line_of_match) || func_ret.test(_1st_line_of_match) ||
				while_op.test(_1st_line_of_match) || if_op.test(_1st_line_of_match) ||
				for_op.test(_1st_line_of_match) || switch_op.test(_1st_line_of_match) ||
				(scope_op_in_D.test (_1st_line_of_match) && yes_D);
			if (!wrong_line && match !== null && match !== undefined) {
				functionName = strn0;
				point = new vscode.Position(line, 0);
				const position: vscode.Range | undefined = document.getWordRangeAtPosition( point );
				pos = position;
				set_rng = position ?? default_range;
				symbols.push(new vscode.SymbolInformation(functionName, vscode.SymbolKind.Function, '', new vscode.Location(document.uri, set_rng)));
			} line++;
	});

		// Extract classes
	/*	while ((match = classPattern.exec(text)) !== null) {
			const className = match[1];
			const position = document.positionAt(match.index);
			symbols.push(new vscode.SymbolInformation(className, vscode.SymbolKind.Class, new vscode.Location(document.uri, position)));
		}*/
		line = 0;
		_1st = true;
	text.forEach(function (strn: string) {
		//	console.log(strn);
		const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
		let strn0 = strn.trim();
		//let _bad_symbs = bad_symbs.test(strn0) || strn0.charAt(strn.length - 1) === ";";
		//text0 = rebuild_doc(line, text);
		match = regex?.exec(strn0);
		let _1st_line_of_match: string = strn0; //match?.[0].split(/\s+/)[0] ?? "";
		let wrong_line: boolean = strn0.charAt(strn.length - 1) === ";" || func_ret.test(_1st_line_of_match) ||
			while_op.test(_1st_line_of_match) || if_op.test(_1st_line_of_match) ||
			for_op.test(_1st_line_of_match) || switch_op.test(_1st_line_of_match) ||
			(scope_op_in_D.test(_1st_line_of_match) && yes_D);
		if (strn0 === "ret_emp save_for_unitst (ret_emp* x) {") {
			prnt(wrong_line.toString());
		}
		if (!wrong_line && match !== null && match !== undefined) {

			functionName = strn0;
			_1st = false;
		} else {
			if (!_1st) {
				set_rng = new vscode.Range(line, 0, line, 300);
				symbols.push(new vscode.SymbolInformation(functionName, vscode.SymbolKind.Variable, '', new vscode.Location(document.uri, set_rng)));
			}
			//outputChannel.appendLine( pos );
			//outputChannel.show();				
		} line++;
		});


		return symbols;
	}
}
export function select_lang_n_tst_fn_head(): RegExp | null { //RegExpExecArray | null {
	const langId = vscode.window.activeTextEditor?.document.uri.fsPath ?? "";
	let regex = /rs$|c$|cpp$|d$/g;
	let lang: string = regex.exec(langId)?.[0] ?? "";
	const msg = "Active lang: " + langId?.toString();
	switch (lang ) {
		case "c": { return c_cpp_d_head() }
		case "cpp": { return c_cpp_d_head() }
		case "d": { return c_cpp_d_head() }
		case "rs": { return rust_head() }
	}
//	prnt(msg);
	return null
}
enum _manage_output {
	C,
	D,
	Rust,
	CPP
}
export function manage_output(doc: string, uri: vscode.Uri, symbols: & vscode.SymbolInformation[]): _manage_output | RegExp | null {
	const langId = vscode.window.activeTextEditor?.document.uri.fsPath ?? "";
	let regex = /rs$|c$|cpp$|d$/g;
	let lang: string = regex.exec(langId)?.[0] ?? "";
	const msg = "Active lang: " + langId?.toString();
	vscode.window.showInformationMessage(msg);
	switch (lang) {
		case "c": { c_fn_body(doc, uri, symbols);  return _manage_output.C  }
		case "cpp": { c_fn_body(doc, uri, symbols); return _manage_output.CPP }
		case "d": { c_fn_body(doc, uri, symbols); return _manage_output.D }
		case "rs": { rust_fn_body(doc, uri, symbols); return _manage_output.Rust }// { return rust_head() }
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
class _block_head {
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
export function c_fn_body(doc: string, uri: vscode.Uri, symbols: &vscode.SymbolInformation[]) {
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
		if (one_line_comment.test(ln) ) {
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
			if ((tmp_quote_state = count_quotes.exec (lines[i])?.length ?? 0) > 0) {
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
export function rust_fn_body(doc: string | string[], uri: vscode.Uri, symbols: & vscode.SymbolInformation[]) {
	const exclude_strns: RegExp = /(\"[\s\S]*?\")/gm
	let tmp_doc: string = Array.isArray(doc) ? function (arr: string[]): string{
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
		if (!within_comment) { within_comment = open_comment.test(lines[i].trim() ); }
		if (within_comment) {
			if (close_comment.test(ln.trim() )) {
				within_comment = false;
			}
			continue;
		}
		if (start_class == null && block_state == 0) {
			if (tst_class.test(lines[i])) {
				if (open_block.test(lines[i])) { opened_class = true; }
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
		block_state -= (search_curlies = no_comments.match(open_block)) != null ? search_curlies.length : 0;
		if (!opened_class && start_class != null && sav_block_state != block_state) {
			block_state += 1;
			opened_class = true;
		}
		block_state += (search_curlies = no_comments.match (close_block)) != null ? search_curlies.length : 0;
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
			if (strn[x] != "\n") { new_strn += symb}
		}
		txt = txt.replace(strn, new_strn);
	});
	rmSync("/tmp/txt");
	writeFileSync("/tmp/txt", txt);
	return txt;
}
export function get_c_fn_head(doc: string[], lnum: number): string {
	for (let i = lnum; i > -1; i--) {
		if (doc[i].includes("(")) { return doc[i]; }
	}
	return doc [0];
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
export function count_spaces_from_left(strn: &string): number {
	for (let x = 0; x < strn.length; x++) {
		if (strn[x] != " ") { return x; }
	}
	return 0
}
export function exclude_comments_from_ln(ln0: &string): string {
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
export function pad_strn_from_left(strn: &string, pad_len: number, pad: string): string {
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
	static writeBkp(data: string, uri?: vscode.Uri, path0?: string): boolean {
		let path: string = uri?.fsPath ?? path0 ?? "";
		if (path == "") { return false; }
		if (!this.bkp_source_file(path)) { return false; }
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
*/