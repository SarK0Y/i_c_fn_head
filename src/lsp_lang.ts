import * as vscode from 'vscode';
import { LanguageClient, NotificationType } from 'vscode-languageclient/node';
import { KeywordsFileOf } from './fs_stuff';
import { prnt } from './basic_funx';
import { rank_msg } from './faav';

export interface set_lang_params {
    lang: string;
    file: string;
}

export namespace lang_proto {
    export const set_lang = new NotificationType<set_lang_params>('i_c_fn_head/setLanguage');
}

export async function send_lang(client: LanguageClient, editor?: vscode.TextEditor | null): Promise<void> {
    const doc = editor?.document;
    if (doc == undefined || doc.uri.scheme != "file") { return }
    const lang = doc.languageId;
    if (lang == "") { return }
    const file = await KeywordsFileOf(lang);
    await prnt("send_lang: " + lang + " -> " + file, rank_msg.dbg);
    await client.sendNotification(lang_proto.set_lang, { lang: lang, file: file });
}

export function watch_active_lang(client: LanguageClient): vscode.Disposable {
    send_lang(client, vscode.window.activeTextEditor);
    return vscode.window.onDidChangeActiveTextEditor(editor => {
        send_lang(client, editor);
    });
}
