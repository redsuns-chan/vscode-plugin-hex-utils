import * as vscode from 'vscode';

export class Config {
    public static isLittleEndian(): boolean {
        let config = vscode.workspace.getConfiguration("");
		let endian = config.get("hex-utils.endian");
        return endian === "Little Endian";
    }
}
