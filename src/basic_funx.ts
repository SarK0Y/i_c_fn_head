import * as vscode from 'vscode';
export function prnt(msg: string) {
    console_msg.show(msg);
}
export function _prnt(msg: string) {
    console_msg.show("Line:" + currentLine() + "\nUri:" + vscode.window.activeTextEditor?.document.uri + "\nMsg:" + msg);
}
export class console_msg {
    static #outputChannel = vscode.window.createOutputChannel('i-c-fn-head');
    static show(msg: string) {
        this.#outputChannel.appendLine(msg);
        this.#outputChannel.show();
    }
}
function currentLine(): number | null {
    const e = new Error();
    const stack = e.stack;
    if (!stack) return null;
    // stack lines vary by engine; this works for V8/Node/Chrome: " at ...:line:col"
    const line = stack.split('\n')[2]; // caller is usually the 3rd line
    const m = line.match(/:(\d+):\d+\)?$/);
    return m ? Number(m[1]) : null;
}