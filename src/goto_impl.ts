import * as vscode from 'vscode';
import { langsName, restrict_search } from './faav'
import { handleExtraCMDs, pressF12, EL } from './fancy_f12';
import { prnt } from './basic_funx';
export class langDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const wordRange = document.getWordRangeAtPosition(position, /[\w$@_]+/);
    //if (!wordRange) return [];
    let word = document.getText(wordRange);
    const extra_locations = word != undefined && word != "" ? handleExtraCMDs(word) : handleExtraCMDs();
    const results: vscode.Location[] = [];
    prnt(extra_locations.kind);
    if (extra_locations.kind == "extra_locations") {
      results.push(...extra_locations.v);
    }
    let file_ext: vscode.GlobPattern = "**/*." + langsName.file_exts[0];
    let uris = await vscode.workspace.findFiles(
      //"**/*.d",
      file_ext,
      restrict_search.exclude_paths, 
      restrict_search.max_num_of_res);
    if (langsName.file_exts.length > 1) {
      for (let i = 1; i < langsName.file_exts.length; i++) {
        file_ext = "**/*." + langsName.file_exts[i];
        let uri = await vscode.workspace.findFiles(
          //   '**/*.{langsName.file_exts}',
            file_ext,
            restrict_search.exclude_paths,
            restrict_search.max_num_of_res);
        uris.push(...uri);
      }
    }
    for (const uri of uris) {
      if (token.isCancellationRequested) break;
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        const text = doc.getText();
        let idx = text.indexOf(word);
      //  vscode.window.showInformationMessage(idx.toString());
        while (idx !== -1) {
          if (token.isCancellationRequested) break;
          // crude heuristic: treat occurrences followed by '(' or ':' or '=' as possible definitions
          const after = text.substr(idx + word.length, 3);
          const isDef = /[\s\(=:\{]/.test(after);
          if (isDef) {
            const start = doc.positionAt(idx);
            const end = doc.positionAt(idx + word.length);
            results.push(new vscode.Location(uri, new vscode.Range(start, end)));
          }
          idx = text.indexOf(word, idx + 1);
        }
      } catch {
        // ignore files that can't be opened
      }
    }
    return results;
  }
}