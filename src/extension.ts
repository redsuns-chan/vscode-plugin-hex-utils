// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parseHexToFloat, reverseHex } from './hex-utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('HEX Utilities plugin installed');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableHexToLetFloat = vscode.commands.registerCommand('hex-utils.hexToLeFloat', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		if (vscode.window.activeTextEditor) {
			const editor = vscode.window.activeTextEditor;
			const selection = editor.selection;
			if (!selection?.isEmpty) {
				const selectionStart: vscode.Position = selection.start;
				const selectionEnd: vscode.Position = selection.end;
				const selectedRange: vscode.Range = new vscode.Range(selectionStart, selectionEnd);
				let selected: string = editor.document.getText();
				selected = selected.replaceAll(/([^a-fA-F0-9])+/g, "");
				console.log("total size : " + selected.length / 2 + " bytes");
				let isAll8Bytes = selected.length % 8;
				console.log("length % 8 = " + isAll8Bytes);
				if (isAll8Bytes !== 0) {
					return vscode.window.showInformationMessage("invalid float hex");
				}
				let parsed: string[] = [];
				for (let i: number = 0; i < selected.length; i += 8) {
					let converting: string = selected.substring(i, i + 8);
					converting = reverseHex(converting);
					console.log("converting : " + converting);
					let floatStr = parseHexToFloat("0x" + converting);
					if (floatStr) {
						parsed.push(floatStr.toPrecision(2));
					} else {
						parsed.push("nan");
					}
				}
				let replacer = new vscode.WorkspaceEdit();
				replacer.replace(editor.document.uri, selectedRange, parsed.join(", "));
				vscode.workspace.applyEdit(replacer);
				vscode.window.showInformationMessage("HEX converted to Float");
			} else {
				vscode.window.showInformationMessage("no selected string");
			}
		} else {
			vscode.window.showInformationMessage("no active editor");
		}
	});

	context.subscriptions.push(disposableHexToLetFloat);
}

// this method is called when your extension is deactivated
export function deactivate() {}
