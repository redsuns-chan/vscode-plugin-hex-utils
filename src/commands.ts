import * as vscode from 'vscode';
import { Config } from './config-utils';
import { parseHexToFloat, parseHexToSignedInt, reverseHex } from './hex-utils';
import { getSelectedText, message, replaceSelectedText } from './vscode-utils';

export function startHexToFloat() {
	console.log("startHexToFloat()");
	
	let selected = getSelectedText().replaceAll(/([^a-fA-F0-9])+/g, "");
	if (selected.length % 8 !== 0) {
		return message("invalid float hex");
	}
	let parsed: string[] = [];
	for (let i: number = 0; i < selected.length; i += 8) {
		let converting: string = selected.substring(i, i + 8);
		converting = Config.isLittleEndian() ? reverseHex(converting) : converting;
		let floatStr = parseHexToFloat("0x" + converting);
		if (floatStr) {
			parsed.push(floatStr.toPrecision(2));
		} else {
			parsed.push("nan");
		}
	}
	replaceSelectedText(parsed.join(", "));
	message("HEX converted to Float");
}

export function startHexToInt() {
	console.log("startHexToInt()");
	if (!vscode.window.activeTextEditor) {
		return message("startHexToInt(): No active editor.");
	}
	const editor = vscode.window.activeTextEditor;
	const selection = editor.selection;
	if (selection?.isEmpty) {
		return message("Please select something first");
	}
	let selected: string = getSelectedText().replaceAll(/([^a-fA-F0-9])+/g, "");
	if (selected.length % 8 !== 0) {
		return message("invalid integer hex");
	}
	let parsed: string[] = [];
	let length = 8;
	for (let i: number = 0; i < selected.length; i += length) {
		let converting: string = selected.substring(i, i + length);
		converting = Config.isLittleEndian() ? reverseHex(converting) : converting;
		let intStr = parseHexToSignedInt(converting);
		if (intStr) {
			parsed.push("" + intStr);
		} else {
			parsed.push("nan");
		}
	}
	replaceSelectedText(parsed.join(", "));
	message("HEX converted to Integer");
}

export function startHexToStr() {
	console.log("startHexToStr()");
	if (!vscode.window.activeTextEditor) {
		return message("startHexToStr(): No active editor.");
	}
	const editor = vscode.window.activeTextEditor;
	const selection = editor.selection;
	if (selection?.isEmpty) {
		return message("Please select something first");
	}
	let selected: string = getSelectedText().replaceAll(/([^a-fA-F0-9])+/g, "");
	if (selected.length % 4 !== 0) {
		return message("Invalid UTF-8 Hex Code");
	}
	let parsed: string[] = [];
	let length = 4;
	for (let i: number = 0; i < selected.length; i += length) {
		let converting: string = selected.substring(i, i + length);
		converting = Config.isLittleEndian() ? reverseHex(converting) : converting;
		if (converting === "0000") {
			parsed.push(" ");
		} else {
			let num = parseInt(converting, 16);
			parsed.push(num === null ? "" : String.fromCharCode(num));
		}
	}
	replaceSelectedText(parsed.join(""));
	message("HEX converted to String");
}
