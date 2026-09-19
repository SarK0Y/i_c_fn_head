import * as vscode from 'vscode';
import * as fs from 'fs';
import { JavaHome, Jar } from './fs_stuff';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    NotificationType
} from 'vscode-languageclient/node';

let client: LanguageClient;

export async function conf(context: vscode.ExtensionContext) {
    const jarPath = await Jar();
    if (!jarPath || !fs.existsSync(jarPath)) {
        return;
    }
    const serverOptions: ServerOptions = {
        command: 'java',
        args: ['-DLOG_PATH=/tmp/loggy', '-jar', jarPath]
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'java' }],

        // Specify initial settings
        initializationOptions: {
            javaHome: await JavaHome(),
            maxProblems: 50
        },

        // Define which settings to send on change
        synchronize: {
            configurationSection: ['java.server']
        }
    };

    client = new LanguageClient(
        'javaLsp',
        'Java LSP Server',
        serverOptions,
        clientOptions
    );

    // Register for configuration change notifications from server
    client.onNotification(
        new NotificationType<string>('custom/configurationChanged'),
        (message) => {
            console.log('[CLIENT] Server config change:', message);
            vscode.window.showInformationMessage(message);
        }
    );

    // Listen for VS Code configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async (e) => {
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
        })
    );

    await client.start();

    // Register commands to modify configuration at runtime
    context.subscriptions.push(
        vscode.commands.registerCommand('java.changeMaxProblems', async () => {
            const value = await vscode.window.showInputBox({
                prompt: 'Enter max problems count',
                value: '100'
            });

            if (value) {
                const config = vscode.workspace.getConfiguration('java.server');
                await config.update('maxProblems', parseInt(value),
                    vscode.ConfigurationTarget.Workspace);
            }
        }),

        vscode.commands.registerCommand('java.toggleDiagnostics', async () => {
            const config = vscode.workspace.getConfiguration('java.server');
            const current = config.get<boolean>('enableDiagnostics');
            await config.update('enableDiagnostics', !current,
                vscode.ConfigurationTarget.Workspace);
        }),

        vscode.commands.registerCommand('java.setClasspath', async () => {
            const classpath = await vscode.window.showInputBox({
                prompt: 'Enter classpath entries (comma-separated)',
                value: '/path/to/lib1.jar,/path/to/lib2.jar'
            });

            if (classpath) {
                const config = vscode.workspace.getConfiguration('java.server');
                await config.update('classpath', classpath.split(','),
                    vscode.ConfigurationTarget.Workspace);
            }
        }),

        vscode.commands.registerCommand('java.updateFormatting', async () => {
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
        })
    );
}

export function deactivate() {
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