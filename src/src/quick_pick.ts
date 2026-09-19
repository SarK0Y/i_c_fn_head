import * as vscode from 'vscode';
export function menu() {

    async function showQuickPickExample() {
        const items: vscode.QuickPickItem[] = [
            { label: '$(file-text) Open file', description: 'Open a file from workspace', detail: 'Opens the file picker' },
            { label: '$(gear) Settings', description: 'Open settings', detail: 'Show configuration' },
            { label: '$(repo) Clone repo', description: 'Clone a repository', detail: 'Clone from URL' },
        ];

        // Single-select QuickPick (simple)
        const single = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose an action',
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false,
        });
        if (single) {
            vscode.window.showInformationMessage(`Selected: ${single.label}`);
        }

        // Multi-select QuickPick (programmatic QuickPick for more control)
        const qp = vscode.window.createQuickPick<vscode.QuickPickItem>();
        qp.items = items;
        qp.canSelectMany = true;
        qp.matchOnDescription = true;
        qp.matchOnDetail = true;
        qp.placeholder = 'Select one or more actions';
        qp.ignoreFocusOut = true;

        qp.onDidAccept(() => {
            const selected = qp.selectedItems;
            if (selected.length) {
                vscode.window.showInformationMessage(`Selected: ${selected.map(s => s.label).join(', ')}`);
            }
            qp.hide();
        });

        qp.onDidHide(() => qp.dispose());
        qp.show();
    }

}