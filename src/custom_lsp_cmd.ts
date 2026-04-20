import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    NotificationType,
    RequestType
} from 'vscode-languageclient/node';

// Define the same DTOs in TypeScript
interface CustomRequest {
    query: string;
    count: number;
}

interface CustomResponse {
    result: string;
    total: number;
    score: number;
}

interface CustomNotification {
    message: string;
    priority: number;
    timestamp: number;
}

interface CustomClientNotification {
    status: string;
    code: number;
}

interface ClientQuestion {
    question: string;
    timeout: number;
}

interface ClientResponse {
    answer: string;
    confirmed: boolean;
    retryCount: number;
}

// Define the custom protocol
namespace CustomProtocol {
    export const getDataRequest = new RequestType<CustomRequest, CustomResponse, void>(
        'custom/getData'
    );

    export const notifyRequest = new NotificationType<CustomNotification>(
        'custom/notify'
    );

    export const clientNotification = new NotificationType<CustomClientNotification>(
        'custom/clientNotification'
    );

    export const askClientRequest = new RequestType<ClientQuestion, ClientResponse, void>(
        'custom/askClient'
    );
}

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
    // Server configuration
    const serverOptions: ServerOptions = {
        command: 'java',
        args: ['-jar', context.asAbsolutePath('out/java-lsp-server.jar')]
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'java' }]
    };

    client = new LanguageClient(
        'customJavaLsp',
        'Custom Java LSP',
        serverOptions,
        clientOptions
    );

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
    console.log('[CLIENT] Language client started');

    // Register commands to send data TO server
    context.subscriptions.push(
        vscode.commands.registerCommand('custom.sendRequest', sendRequestToServer),
        vscode.commands.registerCommand('custom.sendNotification', sendNotificationToServer)
    );
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
        const request: CustomRequest = {
            query: query,
            count: parseInt(countStr)
        };

        console.log('[CLIENT] Sending request:', request);

        const response = await client.sendRequest(
            CustomProtocol.getDataRequest,
            request
        );

        console.log('[CLIENT] Got response:', response);
        vscode.window.showInformationMessage(
            `Server responded: ${response.result} (total: ${response.total}, score: ${response.score})`
        );
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
        const notification: CustomNotification = {
            message: message,
            priority: parseInt(priorityStr),
            timestamp: Date.now()
        };

        console.log('[CLIENT] Sending notification:', notification);

        client.sendNotification(CustomProtocol.notifyRequest, notification);

        vscode.window.showInformationMessage(`Notification sent: ${message}`);
    }
}

export function deactivate() {
    if (client) {
        return client.stop();
    }
}