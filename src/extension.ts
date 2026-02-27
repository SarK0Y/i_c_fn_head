// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AccessibilityInformation as wa } from 'vscode';
import { writeFileSync, readFileSync, copyFileSync, closeSync, existsSync } from "fs";
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
		if (manage_output(text0, document.uri, symbols) != _manage_output.Rust) { return symbols; }
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
	const langId = vscode.window.activeTextEditor?.document.languageId;
	const msg = "Active lang: " + langId?.toString();
	switch (langId?.toLowerCase() ) {
		case "c": { return c_cpp_d_head() }
		case "cpp": { return c_cpp_d_head() }
		case "d": { return c_cpp_d_head() }
		case "rust": { return rust_head() }
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
	const langId = vscode.window.activeTextEditor?.document.languageId;
	const msg = "Active lang: " + langId?.toString();
	switch (langId?.toLowerCase()) {
		case "c": { c_fn_body(doc, uri, symbols);  return _manage_output.C  }
		case "cpp": { c_fn_body(doc, uri, symbols); return _manage_output.CPP }
		case "d": { c_fn_body(doc, uri, symbols); return _manage_output.D }
		case "rust": { return rust_head() }
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
export function c_fn_body(doc: string, uri: vscode.Uri, symbols: &vscode.SymbolInformation[]) {
	let lines: string[] = doc.split("\n");
	for (let i = 0; i < lines.length; i++) {
		lines[i] = lines[i].trim();
	}
	const one_line_comment: RegExp = /^[/]{2}/;
	const one_line_block: RegExp = /.*\{.*\}.*/;
	const open_comment: RegExp = /^\/\*/;
	const close_comment: RegExp = /\*\/$/;
	const open_block: RegExp = /\{/;//(^\{([/]{2})?(\/\*)?)|(\{([/]{2})?(\/[\*]*)?$)/;
	const close_block: RegExp = /\}/;//(^\}([/]{2})?(\/\*)?)|(\}([/]{2})?(\/[\*]*)?$)/;
	const tst_class: RegExp = /\sclass\s/; 
	let within_comment: boolean = false;
	let start_class: number | null = null;
	let start_block: number | null = null;
	let block_state: number = 0;
	let fn_head: string = "";
	let search_curlies: RegExpExecArray | null = null;
	let ln: string;
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
				start_class = i;
			}
		}
		if (start_class != null && block_state == 0 && close_block.test(lines[i])) {
			add_symb(
				start_class,
				i,
				lines[start_class].replace("class", ""),
				"Class",
				uri,
				symbols
			);
			start_class = null;
			continue;
		}
		block_state -= (search_curlies = open_block.exec(lines[i])) != null  ? search_curlies.length : 0;
		block_state += (search_curlies = close_block.exec(lines[i])) != null ? search_curlies.length : 0;
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
	let ret: string = "";
	let reformat = false;
	let _txt = typeof txt == "string" ? txt.split("\n") : txt;
	const one_line_comment: RegExp = /^[/]{2}/;
	const open_comment: RegExp = /^\/\*/;
	const close_comment: RegExp = /\*\/$/;
	let within_comment = false;
	_txt.forEach(function (strn0: string) {
		let strn = strn0.trim();
		const last_indx = strn.length - 1;
		if (one_line_comment.test(strn)) {
			return;
		}
		if (!within_comment) { within_comment = open_comment.test(strn); }
		if (within_comment) {
			if (close_comment.test(strn)) {
				within_comment = false;
			}
			return;
		}
		if (strn[0] == "{") {
			strn = strn[0] + "\n" + strn.substring(1);
			reformat = true;
		}
		if (strn.charAt(last_indx) == "}") {
			strn = strn.substring(0, last_indx - 1) + "\n" + "}";
			reformat = true;
		}
		ret += strn;
	});
}
class sync_bkp {
	static bkuped: string[] | null = null;
	static suffix: string = ".YourOriginalFile";
	static bkp_source_file(path: vscode.Uri): boolean {
		if (this.file_was_bkuped7(path)) { return false; }
		let copy_name = path.fsPath + this.suffix;
		if (existsSync(copy_name)) { return false; }
		copyFileSync(path.fsPath, copy_name);
		
		return false;
	}
	static file_was_bkuped7(path: vscode.Uri): boolean {
		if (this.bkuped == null) { return false; }
		let ret: boolean | null = null;
		this.bkuped.forEach(function (strn: string, indx: number, arr: string[]) { 
			if (strn == path.fsPath) { ret = true; return; }
		});
		return ret == null ? false : ret;
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
}
//fn
/*
class MyDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        // Logic to extract symbols from the document
        return [
            new vscode.SymbolInformation('MyFunction', vscode.SymbolKind.Function, new vscode.Location(document.uri, new vscode.Position(1, 2))),
            // Add more symbols here
        ];
    }
}

// Register the provider in the activate function
context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: 'javascript' }, new MyDocumentSymbolProvider()));

// extract stuff
import * as vscode from 'vscode';

class MyDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        const symbols: vscode.SymbolInformation[] = [];

        const text = document.getText();

        // Regular expression patterns for different symbols
        const functionPattern = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/g;
        const classPattern = /class\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
        const variablePattern = /const\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|let\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|var\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;

        // Extract functions
        let match;
        while ((match = functionPattern.exec(text)) !== null) {
            const functionName = match[1];
            const position = document.positionAt(match.index);
            symbols.push(new vscode.SymbolInformation(functionName, vscode.SymbolKind.Function, new vscode.Location(document.uri, position)));
        }

        // Extract classes
        while ((match = classPattern.exec(text)) !== null) {
            const className = match[1];
            const position = document.positionAt(match.index);
            symbols.push(new vscode.SymbolInformation(className, vscode.SymbolKind.Class, new vscode.Location(document.uri, position)));
        }

        // Extract variables
        while ((match = variablePattern.exec(text)) !== null) {
            const variableName = match[1] || match[2] || match[3];
            const position = document.positionAt(match.index);
            symbols.push(new vscode.SymbolInformation(variableName, vscode.SymbolKind.Variable, new vscode.Location(document.uri, position)));
        }

        return symbols;
    }
}

// Register the provider in the activate function
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider({ language: 'javascript' }, new MyDocumentSymbolProvider())
    );
}

export function deactivate() {}
*/