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
exports.custom_lsp = custom_lsp;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs_stuff_1 = require("./fs_stuff");
const faav_1 = require("./faav");
const lsp_lang_1 = require("./lsp_lang");
const node_1 = require("vscode-languageclient/node");
const basic_funx_1 = require("./basic_funx");
// Define the custom protocol
var CustomProtocol;
(function (CustomProtocol) {
    CustomProtocol.getDataRequest = new node_1.RequestType('custom/getData');
    CustomProtocol.notifyRequest = new node_1.NotificationType('custom/notify');
    CustomProtocol.clientNotification = new node_1.NotificationType('custom/clientNotification');
    CustomProtocol.askClientRequest = new node_1.RequestType('custom/askClient');
})(CustomProtocol || (CustomProtocol = {}));
let client;
async function custom_lsp(context) {
    // Server configuration
    const keywords_file = await (0, fs_stuff_1.KeywordsFileOf)("java");
    const serverOptions = {
        command: 'java',
        args: [
            '-DLOG_PATH=/tmp/loggy',
            ...(keywords_file == "" ? [] : ['-DkeywordsFile=' + keywords_file]),
            '-cp',
            await (0, fs_stuff_1.Jar)(),
            'Main.main0'
        ]
    };
    basic_funx_1.sync_bkp.raw_writeBkp(serverOptions.args?.toString() ?? "none", null, "/tmp/lsp_args");
    const clientOptions = {
        documentSelector: (0, faav_1.lang_sel)()
    };
    client = new node_1.LanguageClient('customJavaLsp', 'Custom Java LSP', serverOptions, clientOptions);
    // Register handler for notifications FROM server
    client.onNotification(CustomProtocol.clientNotification, (notification) => {
        console.log(`[CLIENT] Received server notification: ${notification.status} (${notification.code})`);
        vscode.window.showInformationMessage(`Server: ${notification.status}`);
    });
    // Register handler for requests FROM server (server asking client something)
    client.onRequest(CustomProtocol.askClientRequest, async (question) => {
        console.log(`[CLIENT] Server asks: ${question.question} (timeout: ${question.timeout}ms)`);
        const answer = await vscode.window.showInputBox({
            prompt: question.question,
            placeHolder: 'Type your answer'
        });
        const confirmed = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Confirm?'
        }) === 'Yes';
        return {
            answer: answer || 'no answer',
            confirmed: confirmed,
            retryCount: 0
        };
    });
    await client.start();
    (0, lsp_lang_1.set_client)(client);
    console.log('[CLIENT] Language client started');
    context.subscriptions.push((0, lsp_lang_1.watch_active_lang)(client));
    // Register commands to send data TO server
    context.subscriptions.push(vscode.commands.registerCommand('custom.sendRequest', sendRequestToServer), vscode.commands.registerCommand('custom.sendNotification', sendNotificationToServer));
}
// Send request to server (expects response)
async function sendRequestToServer() {
    const query = await vscode.window.showInputBox({
        prompt: 'Enter query string'
    });
    const countStr = await vscode.window.showInputBox({
        prompt: 'Enter count (number)'
    });
    if (query && countStr) {
        const request = {
            query: query,
            count: parseInt(countStr)
        };
        console.log('[CLIENT] Sending request:', request);
        const response = await client.sendRequest(CustomProtocol.getDataRequest, request);
        console.log('[CLIENT] Got response:', response);
        vscode.window.showInformationMessage(`Server responded: ${response.result} (total: ${response.total}, score: ${response.score})`);
    }
}
// Send notification to server (fire and forget)
async function sendNotificationToServer() {
    const message = await vscode.window.showInputBox({
        prompt: 'Enter notification message'
    });
    const priorityStr = await vscode.window.showInputBox({
        prompt: 'Enter priority (1-10)'
    });
    if (message && priorityStr) {
        const notification = {
            message: message,
            priority: parseInt(priorityStr),
            timestamp: Date.now()
        };
        console.log('[CLIENT] Sending notification:', notification);
        client.sendNotification(CustomProtocol.notifyRequest, notification);
        vscode.window.showInformationMessage(`Notification sent: ${message}`);
    }
}
function deactivate() {
    if (client) {
        return client.stop();
    }
}
/*
{
    "contributes": {
        "commands": [
            {
                "command": "custom.sendRequest",
                "title": "Custom: Send Request to Server"
            },
            {
                "command": "custom.sendNotification",
                "title": "Custom: Send Notification to Server"
            }
        ]
    },
    "activationEvents": [
        "onLanguage:java"
    ]
}
*/ 
//# sourceMappingURL=custom_lsp_cmd.js.map