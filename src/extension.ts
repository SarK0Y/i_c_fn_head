// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AccessibilityInformation as wa } from 'vscode';
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
		const text0 = document.getText();
		const text = text0.split("\n");

		// Regular expression patterns for different symbols
		const functionPattern: RegExp[] = [
			/(^(\s*if))/g,
		];
		const classPattern = /class\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
		const variablePattern = /const\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|let\s+([a-zA-Z_$][0-9a-zA-Z_$]*)|var\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
		let wrong_ending = /;(\s)?$/
		const func_ret = /^\s*return\s/;
		// Extract functions
		let match: RegExpExecArray | null | undefined = null;
		//console.log("start");
		//console.log(text);
		let _match;
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
		let regex = select_lang_n_tst_fn_head();
		text.forEach(function (strn: string) {
			let wrong_line: boolean = wrong_ending.test(strn) || func_ret.test(strn);
			if (regex !== null && !wrong_line && (match = regex.exec(text0)) !== null) {
				functionName = strn;
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
/*	text.forEach(function (strn: string) {
		//	console.log(strn);
		const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
		if ((match = select_lang_n_tst_fn_head(strn)) !== null) {
			functionName = strn;
			_1st = false;
		} else {
			if (!_1st) {
				set_rng = new vscode.Range(line, 0, line, 300);
				symbols.push(new vscode.SymbolInformation(functionName, vscode.SymbolKind.Variable, '', new vscode.Location(document.uri, set_rng)));
			}
			//outputChannel.appendLine( pos );
			//outputChannel.show();				
		} line++;
		});*/


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
export function c_cpp_d_head(): RegExp {
	const regex: RegExp = /^\s*(?:[\w\s\_\:\*&]*\s+)(\w+)\s*(\(\w\))?\(([^)]*)\)\s*\{?([0-9a-zA-Z\n\s\"\"]*\})?(?!;)$/gm;
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