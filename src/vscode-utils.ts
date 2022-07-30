
import { start } from 'repl';
import * as vscode from 'vscode';

export function log(log: string) {
	console.log(log);
}

export function message(message: string) {
	return vscode.window.showInformationMessage("No active editor exists");
}

export function getSelectRange(editor: vscode.TextEditor): vscode.Range {
	let startPos: vscode.Position = editor.selection.start;
	let endPos: vscode.Position = editor.selection.end;
	return new vscode.Range(startPos, endPos);
}
