
import * as vscode from 'vscode';
import { mapping } from "./mapping";

export function activate(context: vscode.ExtensionContext) {
	console.log('HEX Utilities plugin installed');
	Object.entries(mapping).forEach(([key, value]) => {
		context.subscriptions.push(vscode.commands.registerCommand('hex-utils.' + key, value));
	});
}

// this method is called when your extension is deactivated
export function deactivate() { 
	console.log('HEX Utilities plugin deactivated');
}
