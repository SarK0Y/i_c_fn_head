import * as vscode from 'vscode';
import { _c_fn_body, _rust_fn_body, c_fn_body } from './fn_body_n_head';
export class ShowDocumentSymbols implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        let symbols: vscode.SymbolInformation[] = [];
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
    }
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
    //vscode.window.showInformationMessage(msg);
    switch (lang) {
        case "c": { c_fn_body(doc, uri, symbols); return _manage_output.C }
        case "cpp": { c_fn_body(doc, uri, symbols); return _manage_output.CPP }
        case "d": { _c_fn_body(doc, uri, symbols); return _manage_output.D }
        case "rs": { _rust_fn_body(doc, uri, symbols); return _manage_output.Rust }// { return rust_head() }
    }
    //	prnt(msg);
    return null
}
