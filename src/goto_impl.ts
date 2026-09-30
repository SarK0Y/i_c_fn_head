import * as vscode from 'vscode';
import { rank_msg } from './faav'
import { prnt } from './basic_funx';
import { definitions } from './fancy_f12';

export class langDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location[]> {
    try {
      await prnt("provideDefinition: entered lang=" + document.languageId + " scheme=" + document.uri.scheme
        + " " + document.uri.fsPath + ":" + (position.line + 1), rank_msg.dbg);
      return await definitions(document, position, token);
    } catch (err) {
      await prnt("provideDefinition: " + String(err), rank_msg.err);
      return [];
    }
  }
}
