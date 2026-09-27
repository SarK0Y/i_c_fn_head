"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.extra_activate = extra_activate;
exports.activate0 = activate0;
const vscode = __importStar(require("vscode"));
const minimatch_1 = require("minimatch");
function extra_activate() {
    return activate_;
}
const activate_ = `
  //  console.log('Extension "color-my-text" is activated.');

    let allConfigData: ConfigData[] = [];

    // todoEditors need (re)decoration; doneEditors are already up to date.
    // Tracking both avoids re-decorating unchanged editors when unrelated ones become visible.
    let todoEditors: vscode.TextEditor[] = [];
    let doneEditors: vscode.TextEditor[] = [];

    // Disposes old decoration types and rebuilds allConfigData from current settings.
    function resetDecorations(): void {
        todoEditors = vscode.window.visibleTextEditors.slice();
        doneEditors = [];

        allConfigData.forEach(configData => configData.ruleData.forEach(ruleData => ruleData.decorationType.dispose()));

        const configurations = vscode.workspace.getConfiguration('i_c_fn_head').get<Configuration[]>('configurations');
        allConfigData = toArray(configurations).map(configuration => ({
            globs: toArray(configuration.paths),
            ruleData: toArray(configuration.rules).map(buildRuleData),
        }));
    }

    // Applies decorations to all queued editors. Runs on a 500ms timer to batch rapid edits.


    vscode.workspace.onDidChangeConfiguration(
        event => {
            if (event.affectsConfiguration('i_c_fn_head.configurations')) {
                resetDecorations();
            }
        },
        null,
        context.subscriptions);

    vscode.window.onDidChangeVisibleTextEditors(
        visibleEditors => {
            // Queue newly visible editors; prune editors that were closed.
            todoEditors = visibleEditors.filter(editor => !doneEditors.includes(editor));
            doneEditors = doneEditors.filter(editor => visibleEditors.includes(editor));
            updateDecorations();
        },
        null,
        context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(
        event => {
            // Re-queue any visible editor showing the changed document.
            vscode.window.visibleTextEditors.forEach(visibleEditor => {
                if (visibleEditor.document === event.document && !todoEditors.includes(visibleEditor)) {
                    todoEditors.push(visibleEditor);
                }
            });

            doneEditors = doneEditors.filter(editor => !todoEditors.includes(editor));
        },
        null,
        context.subscriptions);

    resetDecorations();
    function updateDecorations(): void {
        return _updateDecorations(
            allConfigData,
            todoEditors,
            doneEditors
        );
    }
    const intervalId = setInterval(updateDecorations, 500);
    context.subscriptions.push({ dispose: () => clearInterval(intervalId) });

`;
function toArray(value) {
    return Array.isArray(value) ? value : [];
}
// ANSI color names map to VS Code terminal theme tokens ('terminal.ansi<Name>').
const ansiColorNames = new Set([
    'Black', 'Blue', 'BrightBlack', 'BrightBlue', 'BrightCyan', 'BrightGreen',
    'BrightMagenta', 'BrightRed', 'BrightWhite', 'BrightYellow',
    'Cyan', 'Green', 'Magenta', 'Red', 'White', 'Yellow',
]);
function buildRuleData(rule) {
    const color = typeof rule.color !== 'string' ? undefined
        : ansiColorNames.has(rule.color) ? new vscode.ThemeColor('terminal.ansi' + rule.color)
            : rule.color;
    // 'none' explicitly removes any theme-inherited decoration when either flag is false.
    const textDecoration = rule.underline === true && rule.strikeThrough === true ? 'underline line-through'
        : rule.underline === true ? 'underline'
            : rule.strikeThrough === true ? 'line-through'
                : rule.underline === false || rule.strikeThrough === false ? 'none'
                    : undefined;
    const decorationType = vscode.window.createTextEditorDecorationType({
        color,
        fontWeight: typeof rule.bold !== 'boolean' ? undefined : rule.bold ? 'bold' : 'normal',
        fontStyle: typeof rule.italic !== 'boolean' ? undefined : rule.italic ? 'italic' : 'normal',
        textDecoration,
    });
    const flags = 'g' + (rule.matchCase === true ? '' : 'i') + (rule.multiLine === true ? 's' : '') + 'u';
    const regexes = toArray(rule.patterns).flatMap(pattern => {
        try {
            return [new RegExp(pattern, flags)];
        }
        catch {
            return []; // Skip invalid regex patterns.
        }
    });
    return { decorationType, regexes, multiLine: rule.multiLine === true };
}
function activate0(context) {
    //  console.log('Extension "color-my-text" is activated.');
    let allConfigData = [];
    // todoEditors need (re)decoration; doneEditors are already up to date.
    // Tracking both avoids re-decorating unchanged editors when unrelated ones become visible.
    let todoEditors = [];
    let doneEditors = [];
    // Disposes old decoration types and rebuilds allConfigData from current settings.
    function resetDecorations() {
        todoEditors = vscode.window.visibleTextEditors.slice();
        doneEditors = [];
        allConfigData.forEach(configData => configData.ruleData.forEach(ruleData => ruleData.decorationType.dispose()));
        const configurations = vscode.workspace.getConfiguration('i_c_fn_head').get('configurations');
        allConfigData = toArray(configurations).map(configuration => ({
            globs: toArray(configuration.paths),
            ruleData: toArray(configuration.rules).map(buildRuleData),
        }));
    }
    // Applies decorations to all queued editors. Runs on a 500ms timer to batch rapid edits.
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('i_c_fn_head.configurations')) {
            resetDecorations();
        }
    }, null, context.subscriptions);
    vscode.window.onDidChangeVisibleTextEditors(visibleEditors => {
        // Queue newly visible editors; prune editors that were closed.
        todoEditors = visibleEditors.filter(editor => !doneEditors.includes(editor));
        doneEditors = doneEditors.filter(editor => visibleEditors.includes(editor));
        updateDecorations();
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        // Re-queue any visible editor showing the changed document.
        vscode.window.visibleTextEditors.forEach(visibleEditor => {
            if (visibleEditor.document === event.document && !todoEditors.includes(visibleEditor)) {
                todoEditors.push(visibleEditor);
            }
        });
        doneEditors = doneEditors.filter(editor => !todoEditors.includes(editor));
    }, null, context.subscriptions);
    resetDecorations();
    function updateDecorations() {
        return _updateDecorations(allConfigData, todoEditors, doneEditors);
    }
    const intervalId = setInterval(updateDecorations, 500);
    context.subscriptions.push({ dispose: () => clearInterval(intervalId) });
}
function _updateDecorations(allConfigData, todoEditors, doneEditors) {
    if (allConfigData.every(configData => configData.ruleData.length === 0)) {
        return;
    }
    if (todoEditors.length === 0) {
        return;
    }
    todoEditors.forEach(editor => {
        const filePath = vscode.workspace.asRelativePath(editor.document.fileName);
        // Collect rule data from all configurations whose path globs match this editor's file.
        const matchingRuleData = allConfigData.flatMap(configData => configData.globs.some(glob => {
            // A bare filename (no path separators) is matched against any directory level.
            const pattern = glob.includes('/') || glob.includes('\\') ? glob : '**/' + glob;
            return (0, minimatch_1.minimatch)(filePath, pattern, { nocase: process.platform === 'win32' });
        }) ? configData.ruleData : []);
        if (matchingRuleData.length === 0) {
            return;
        }
        let documentText;
        matchingRuleData.forEach(({ decorationType, regexes, multiLine }) => {
            const ranges = [];
            if (multiLine) {
                documentText ??= editor.document.getText();
                for (const regex of regexes) {
                    for (const match of documentText.matchAll(regex)) {
                        if (match.index === undefined || match[0].length === 0) {
                            continue;
                        }
                        const startPos = editor.document.positionAt(match.index);
                        const endPos = editor.document.positionAt(match.index + match[0].length);
                        ranges.push(new vscode.Range(startPos, endPos));
                    }
                }
            }
            else {
                for (const regex of regexes) {
                    for (let lineNum = 0; lineNum < editor.document.lineCount; lineNum++) {
                        for (const match of editor.document.lineAt(lineNum).text.matchAll(regex)) {
                            if (match.index === undefined || match[0].length === 0) {
                                continue;
                            }
                            ranges.push(new vscode.Range(lineNum, match.index, lineNum, match.index + match[0].length));
                        }
                    }
                }
            }
            editor.setDecorations(decorationType, ranges);
        });
        doneEditors.push(editor);
    });
    todoEditors = [];
}
//# sourceMappingURL=colorful.js.map