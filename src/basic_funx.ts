import * as vscode from 'vscode';
export function prnt(msg: string) {
    console_msg.show(msg);
}
export class console_msg {
    static #outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    static show(msg: string) {
        this.#outputChannel.appendLine(msg);
        this.#outputChannel.show();
    }
}
