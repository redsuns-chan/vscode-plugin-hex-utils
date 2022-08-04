import * as vscode from 'vscode';

export function log(msg: string) {
	console.log(msg);
}

export function message(msg: string) {
	return vscode.window.showInformationMessage(msg);
}

export function getSelectedRange(editor: vscode.TextEditor): vscode.Range {
	let startPos: vscode.Position = editor.selection.start;
	let endPos: vscode.Position = editor.selection.end;
	return new vscode.Range(startPos, endPos);
}

export function getSelectedText(): string {
	let selected: string = "";

	if (!vscode.window.activeTextEditor) {
		message("getSelectedText(): No active editor.");
		return selected;
	}
	const editor = vscode.window.activeTextEditor;
	const selection = editor.selection;
	if (selection?.isEmpty) {
		message("Please select something first");
		return selected;
	}
	selected = editor.document.getText();
	return selected;
}

export function replaceSelectedText(text: string) : void {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		message("replaceSelectedText(): No active editor");
		return;
	}
	let replacer = new vscode.WorkspaceEdit();
	replacer.replace(editor.document.uri, getSelectedRange(editor), text);
	vscode.workspace.applyEdit(replacer);
}
