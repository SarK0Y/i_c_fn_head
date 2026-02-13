// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { AccessibilityInformation as wa } from 'vscode';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function handleChangeSel(event) {
	console.log("Change in the text editor");
	for (var i = 0; i < event.selections.length; i++) {
		var selection = event.selections[i];
		console.log("Start- Line: (" + selection.start.line + ") Col: (" + selection.start.character + ") End- Line: (" + selection.end.line + ") Col: (" + selection.end.character + ")");
	}
	var scroll = vscode.workspace.getConfiguration("editorScroll");
	console.log(event);
	var doc: vscode.TextDocument = vscode.workspace.textDocuments[0].;
	let msg = "status bar: " + doc.getText();
	console.log(msg);
}
function handleChangeState(event) {
	//console.log(event);
//	console.log(event.document);
//	var doc: vscode.TextDocument = vscode.TextEditor;
	let msg = "status bar: " + event.document.getText() + "lineat(0) " + event.document.lineAt(0).text +
	event.document.bread;
	console.log(msg);
}
export function activate(context: vscode.ExtensionContext) {

	const outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
	outputChannel.appendLine("tst console msg");
	outputChannel.show();
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
	vscode.window.onDidChangeTextEditorSelection(handleChangeSel);
	vscode.workspace.onDidChangeTextDocument(handleChangeState);
	const disposable1 = vscode.commands.registerCommand('extension.getCursorPosition', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const cursorPosition = editor.selection.active; // Get the active cursor position
			console.log('Cursor Position:', cursorPosition); // Log the position
			vscode.window.showInformationMessage(`Cursor Position: Line ${cursorPosition.line + 1}, Character ${cursorPosition.character + 1}`);
		} else {
			vscode.window.showInformationMessage('No active editor found.');
		}
	});

	context.subscriptions.push(disposable1);
}

// This method is called when your extension is deactivated
export function deactivate() { }
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