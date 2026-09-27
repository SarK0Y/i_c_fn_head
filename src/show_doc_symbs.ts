import * as vscode from 'vscode';
import { _c_fn_body, _rust_fn_body, c_fn_body } from './fn_body_n_head';
import { srv_document_symbols } from './lsp_lang';
export class ShowDocumentSymbols implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[]> {
        // the scanning itself now lives in the jar, this just hands over the
        // in memory text so unsaved buffers still get breadcrumbs
        return srv_document_symbols(document.uri.toString(), vscode.window.activeTextEditor?.document.uri.fsPath ?? "", document.getText()).then(
            (wire_syms) => {
                let symbols: vscode.SymbolInformation[] = [];
                for (const sym of wire_syms) {
                    let rng = new vscode.Range(
                        sym.location.range.start.line, sym.location.range.start.character,
                        sym.location.range.end.line, sym.location.range.end.character);
                    let loc = new vscode.Location(vscode.Uri.parse(sym.location.uri), rng);
                    // lsp's SymbolKind starts at one, vscode's starts at zero
                    let kind = ((sym.kind - 1) as vscode.SymbolKind);
                    symbols.push(new vscode.SymbolInformation(sym.name, kind, sym.containerName, loc));
                }
                return symbols;
            });
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
