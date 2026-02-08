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
	var doc: vscode.TextDocument = vscode.TextEditor;
	let msg = "status bar: " + doc.getText();
	console.log(msg);
}
function handleChangeState(event) {
	//console.log(event);
//	console.log(event.document);
//	var doc: vscode.TextDocument = vscode.TextEditor;
	let msg = "status bar: " + event.document.getText() + "lineat(0) " + event.document.lineAt(0).text;
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
export function deactivate() {}
