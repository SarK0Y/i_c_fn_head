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
exports.conf = conf;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs_stuff_1 = require("./fs_stuff");
const faav_1 = require("./faav");
const lsp_lang_1 = require("./lsp_lang");
const node_1 = require("vscode-languageclient/node");
let client;
async function conf(context) {
    const keywords_file = await (0, fs_stuff_1.KeywordsFileOf)("java");
    const serverOptions = {
        command: 'java',
        args: [
            '-DLOG_PATH=/tmp/loggy',
            ...(keywords_file == "" ? [] : ['-DkeywordsFile=' + keywords_file]),
            '-jar',
            await (0, fs_stuff_1.Jar)()
        ]
    };
    const clientOptions = {
        documentSelector: (0, faav_1.lang_sel)(),
        // Specify initial settings
        initializationOptions: {
            javaHome: await (0, fs_stuff_1.JavaHome)(),
            maxProblems: 50
        },
        // Define which settings to send on change
        synchronize: {
            configurationSection: ['java.server']
        }
    };
    client = new node_1.LanguageClient('javaLsp', 'Java LSP Server', serverOptions, clientOptions);
    // Register for configuration change notifications from server
    client.onNotification(new node_1.NotificationType('custom/configurationChanged'), (message) => {
        console.log('[CLIENT] Server config change:', message);
        vscode.window.showInformationMessage(message);
    });
    // Listen for VS Code configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async (e) => {
        if (e.affectsConfiguration('java.server')) {
            console.log('[CLIENT] Configuration changed in VS Code');
            // Send updated configuration to server
            const config = vscode.workspace.getConfiguration('java.server');
            await client.sendNotification('workspace/didChangeConfiguration', {
                settings: {
                    java: {
                        server: config
                    }
                }
            });
        }
    }));
    await client.start();
    (0, lsp_lang_1.set_client)(client);
    context.subscriptions.push((0, lsp_lang_1.watch_active_lang)(client));
    // Register commands to modify configuration at runtime
    context.subscriptions.push(vscode.commands.registerCommand('java.changeMaxProblems', async () => {
        const value = await vscode.window.showInputBox({
            prompt: 'Enter max problems count',
            value: '100'
        });
        if (value) {
            const config = vscode.workspace.getConfiguration('java.server');
            await config.update('maxProblems', parseInt(value), vscode.ConfigurationTarget.Workspace);
        }
    }), vscode.commands.registerCommand('java.toggleDiagnostics', async () => {
        const config = vscode.workspace.getConfiguration('java.server');
        const current = config.get('enableDiagnostics');
        await config.update('enableDiagnostics', !current, vscode.ConfigurationTarget.Workspace);
    }), vscode.commands.registerCommand('java.setClasspath', async () => {
        const classpath = await vscode.window.showInputBox({
            prompt: 'Enter classpath entries (comma-separated)',
            value: '/path/to/lib1.jar,/path/to/lib2.jar'
        });
        if (classpath) {
            const config = vscode.workspace.getConfiguration('java.server');
            await config.update('classpath', classpath.split(','), vscode.ConfigurationTarget.Workspace);
        }
    }), vscode.commands.registerCommand('java.updateFormatting', async () => {
        const indentSize = await vscode.window.showInputBox({
            prompt: 'Indent size',
            value: '4'
        });
        const useTabs = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Use tabs?'
        }) === 'Yes';
        if (indentSize) {
            const config = vscode.workspace.getConfiguration('java.server');
            await config.update('formatting', {
                indentSize: parseInt(indentSize),
                useTabs: useTabs,
                maxLineLength: 120
            }, vscode.ConfigurationTarget.Workspace);
        }
    }));
}
function deactivate() {
    if (client) {
        return client.stop();
    }
}
/*
{
    "contributes": {
        "configuration": {
            "title": "Java LSP",
            "properties": {
                "java.server.enableDiagnostics": {
                    "type": "boolean",
                    "default": true,
                    "description": "Enable diagnostic messages"
                },
                "java.server.maxProblems": {
                    "type": "number",
                    "default": 100,
                    "description": "Maximum number of problems to report"
                },
                "java.server.javaHome": {
                    "type": "string",
                    "default": "",
                    "description": "Path to Java home directory"
                },
                "java.server.classpath": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "default": [],
                    "description": "Additional classpath entries"
                },
                "java.server.formatting": {
                    "type": "object",
                    "properties": {
                        "indentSize": {
                            "type": "number",
                            "default": 4
                        },
                        "useTabs": {
                            "type": "boolean",
                            "default": false
                        },
                        "maxLineLength": {
                            "type": "number",
                            "default": 120
                        }
                    }
                },
                "java.server.customSettings": {
                    "type": "object",
                    "description": "Custom settings for the server"
                }
            }
        },
        "commands": [
            {
                "command": "java.changeMaxProblems",
                "title": "Java: Change Max Problems"
            },
            {
                "command": "java.toggleDiagnostics",
                "title": "Java: Toggle Diagnostics"
            },
            {
                "command": "java.setClasspath",
                "title": "Java: Set Classpath"
            },
            {
                "command": "java.updateFormatting",
                "title": "Java: Update Formatting"
            }
        ]
    }
}
*/ 
//# sourceMappingURL=Config.js.map