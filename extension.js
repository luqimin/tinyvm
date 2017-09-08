const vscode = require('vscode');
const http = require('http');
const fs = require('fs');
const prettydiff = require("./lib/prettydiff");

function positionFactory(line, char) {
    return new vscode.Position(line, char);
}

function rangeFactory(start, end) {
    return new vscode.Range(start, end);
}

function activate(context) {
    let formatText = vscode.languages.registerDocumentFormattingEditProvider('velocity', {
        provideDocumentFormattingEdits: document => {
            let _data = document.getText();
            console.log(document);
            let output = prettydiff({
                source: _data,
                mode: "beautify",
                lang: "velocity"
            });

            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);

            return [vscode.TextEdit.replace(rangeFactory(firstLine.range.start, lastLine.range.end), output)];
        }
    });
    context.subscriptions.push(formatText);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;