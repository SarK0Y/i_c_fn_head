import * as vscode from 'vscode';
import {langsName} from './faav'
export class langDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const wordRange = document.getWordRangeAtPosition(position, /[\w$]+/);
    if (!wordRange) return [];

    const symbol = document.getText(wordRange);
    const results: vscode.Location[] = [];

    const exclude = '';
    const max = 500;
    const uris = await vscode.workspace.findFiles('**/*.{langsName.file_exts}', exclude, max);

    for (const uri of uris) {
      if (token.isCancellationRequested) break;
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const text = doc.getText();
        let idx = text.indexOf(symbol);
        while (idx !== -1) {
          if (token.isCancellationRequested) break;
          // crude heuristic: treat occurrences followed by '(' or ':' or '=' as possible definitions
          const after = text.substr(idx + symbol.length, 3);
          const isDef = /[\s\(=:\{]/.test(after) && /function|class|def|interface|=>|constructor/.test(text.substr(Math.max(0, idx-50), 100));
          if (isDef) {
            const start = doc.positionAt(idx);
            const end = doc.positionAt(idx + symbol.length);
            results.push(new vscode.Location(uri, new vscode.Range(start, end)));
          }
          idx = text.indexOf(symbol, idx + 1);
        }
      } catch {
        // ignore files that can't be opened
      }
    }
    return results;
  }
}