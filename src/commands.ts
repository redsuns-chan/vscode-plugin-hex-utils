import * as vscode from 'vscode';
import { parseHexToFloat, reverseHex } from './hex-utils';
import { getSelectRange, log, message } from './vscode-utils';

export function startHexToFloat() {
	console.log("startHexToFloat()");
	if (!vscode.window.activeTextEditor) {
		return message("No active editor.");
	}
	const editor = vscode.window.activeTextEditor;
	const selection = editor.selection;
	if (selection?.isEmpty) {
		return message("Please select something first");
	}
	let selectedRange: vscode.Range = getSelectRange(editor);
	let selected: string = editor.document.getText();
	selected = selected.replaceAll(/([^a-fA-F0-9])+/g, "");
	if (selected.length % 8 !== 0) {
		return message("invalid float hex");
	}
	let parsed: string[] = [];
	for (let i: number = 0; i < selected.length; i += 8) {
		let converting: string = selected.substring(i, i + 8);

		let config = vscode.workspace.getConfiguration("");
		let endian = config.get("hex-utils.endian");
		if (endian === "Little Endian") {
			converting = reverseHex(converting);
		}
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
	message("HEX converted to Float");
}

export function startHexToInt() {
	log("startHexToInt()");
}

export function startHexToStr() {
	log("startHexToStr()");
}
