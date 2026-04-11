import * as vscode from 'vscode';
import { langsName, restrict_search } from './faav'
import { handleExtraCMDs, pressF12, EL } from './fancy_f12';
import { prnt, getCMD, exclude_uris } from './basic_funx';
import { uri_to_file_of_opts, msg_opt } from './init';
export class langDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    const file_of_opts = await uri_to_file_of_opts();
    const txt = (await vscode.workspace.openTextDocument(file_of_opts[0])).getText();
    restrict_search.exclude_paths = "**/(" + (await getCMD(
        null,
        txt,
       "exclude_path"
    ))?.[0].source + ")/*";
    const wordRange = document.getWordRangeAtPosition(position, /[\w$@_]+/);
    //if (!wordRange) return [];
    let word = document.getText(wordRange);
    const extra_locations = word != undefined && word != "" ? await handleExtraCMDs(word) : await handleExtraCMDs();
    const results: vscode.Location[] = [];
    await prnt(extra_locations.kind);
    if (extra_locations.kind == "extra_locations") {
      results.push(...extra_locations.v);
    }
    let file_exts = (await langsName()).file_exts;
    let file_ext: vscode.GlobPattern = "**/*." + file_exts[0];
    let uris = await vscode.workspace.findFiles(
      //"**/*.d",
      file_ext,
      restrict_search.exclude_paths, 
      restrict_search.max_num_of_res);
    if (file_exts.length > 1) {
      for (let i = 1; i < file_exts.length; i++) {
        file_ext = "**/*." + file_exts[i];
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