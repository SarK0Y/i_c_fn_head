import * as vscode from 'vscode';
import { LanguageClient, NotificationType, RequestType } from 'vscode-languageclient/node';
import { KeywordsFileOf } from './fs_stuff';
import { prnt } from './basic_funx';
import { rank_msg } from './faav';

export interface set_lang_params {
    lang: string;
    file: string;
}

export interface def_params {
    uri: string;
    srcUri: string;
    word: string;
}

export interface def_pos {
    line: number;
    character: number;
}

export interface def_range {
    start: def_pos;
    end: def_pos;
}

export interface def_loc {
    uri: string;
    range: def_range;
}

export interface doc_syms_params {
    uri: string;
    activeUri: string;
    text: string;
}

export interface doc_sym_location {
    uri: string;
    range: def_range;
}

export interface doc_sym {
    name: string;
    /** lsp SymbolKind is one based, vscode's is not */
    kind: number;
    location: doc_sym_location;
    containerName: string;
}

export namespace lang_proto {
    export const set_lang = new NotificationType<set_lang_params>('i_c_fn_head/setLanguage');
    export const definitions = new RequestType<def_params, def_loc[], void>('i_c_fn_head/definitions');
    export const document_symbols = new RequestType<doc_syms_params, doc_sym[], void>('i_c_fn_head/documentSymbols');
}

let _client: LanguageClient | undefined = undefined;

export function set_client(client: LanguageClient): void {
    _client = client;
}

export function get_client(): LanguageClient | undefined {
    return _client;
}

export async function srv_definitions(uri: string, srcUri: string, word: string): Promise<def_loc[]> {
    if (word == "") { return [] }
    if (_client == undefined) {
        await prnt("srv_definitions: no lsp client", rank_msg.err);
        return [];
    }
    try {
        return await _client.sendRequest(lang_proto.definitions, { uri: uri, srcUri: srcUri, word: word });
    } catch (err) {
        await prnt("srv_definitions: " + String(err), rank_msg.err);
        return [];
    }
}

/**
 * Asks the jar for the document symbols the old typescript scanner used to
 * build, so that breadcrumbs stay byte for byte what they used to be.
 */
export async function srv_document_symbols(uri: string, activeUri: string, text: string): Promise<doc_sym[]> {
    if (_client == undefined) {
        await prnt("srv_document_symbols: no lsp client", rank_msg.err);
        return [];
    }
    try {
        return await _client.sendRequest(lang_proto.document_symbols, { uri: uri, activeUri: activeUri, text: text });
    } catch (err) {
        await prnt("srv_document_symbols: " + String(err), rank_msg.err);
        return [];
    }
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
