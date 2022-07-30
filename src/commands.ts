import * as vscode from 'vscode';
import { parseHexToFloat, reverseHex } from './hex-utils';

export function startHexToFloat() {
	console.log("startHexToFloat()");
	if (vscode.window.activeTextEditor) {
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;
		if (!selection?.isEmpty) {
			const selectionStart: vscode.Position = selection.start;
			const selectionEnd: vscode.Position = selection.end;
			const selectedRange: vscode.Range = new vscode.Range(selectionStart, selectionEnd);
			let selected: string = editor.document.getText();
			selected = selected.replaceAll(/([^a-fA-F0-9])+/g, "");
			if (selected.length % 8 !== 0) {
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
			vscode.window.showInformationMessage("Please select something first");
		}
	} else {
		vscode.window.showInformationMessage("No active editor exists");
	}
}

export function startHexToInt() {
	console.log("startHexToInt()");
}

export function startHexToStr() {
	console.log("startHexToStr()");
}
