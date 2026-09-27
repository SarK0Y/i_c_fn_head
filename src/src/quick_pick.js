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
exports.menu = menu;
const vscode = __importStar(require("vscode"));
function menu() {
    async function showQuickPickExample() {
        const items = [
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
        const qp = vscode.window.createQuickPick();
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
//# sourceMappingURL=quick_pick.js.map