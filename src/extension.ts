// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function reverseHex(hex: string): string {
	let reversed: string = "";
	if (hex.toLowerCase().startsWith("0x")) {
		hex = hex.substring(0, 2);
	}
	for (let i: number = 8; i >= 0; i -= 2) {
		reversed += hex.substring(i - 2, i);
	}
	console.log("reversed : " + hex + " -> " + reversed);
	return reversed;
}
/**
 * Convert HEX to Float
 * 
 * @see https://stackoverflow.com/a/14090278
 * @param hex 
 * @returns 
 */
function parseHexToFloat(hex: any): number | null {
	let float = 0, sign, mantissa, exp,
	int = 0, multi = 1;
	if (/^0x/.exec(hex)) {
		int = parseInt(hex, 16);
	}
	else {
		for (let i = hex.length - 1; i >=0; i -= 1) {
			if (hex.charCodeAt(i) > 255) {
				console.log('Wrong string parameter');
				return null;
			}
			int += hex.charCodeAt(i) * multi;
			multi *= 256;
		}
	}
	sign = (int >>> 31) ? -1 : 1;
	exp = (int >>> 23 & 0xff) - 127;
	mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
	for (let m of mantissa) {
		float += parseInt(m) ? Math.pow(2, exp) : 0;
		exp--;
	}
	return float*sign;
}



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('HEX Utilities plugin installed');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hex-utils.hexToLeFloat', () => {
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

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
