const vscode = require('vscode');
const http = require('http');
const fs = require('fs');
const prettydiff = require("./lib/prettydiff");

let formatOptions = {
    mode: "beautify",
    html: true,
    lang: "velocity",
    apacheVelocity: true,
    cssinsertlines: true,
    wrap: 100,
    comments: "indent",
    commline: false,
    style: "indent",
};

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
            let output = prettydiff(Object.assign({
                source: _data
            }, formatOptions));

            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);

            return [vscode.TextEdit.replace(rangeFactory(firstLine.range.start, lastLine.range.end), output)];
        }
    });
    let formatRange = vscode.languages.registerDocumentRangeFormattingEditProvider('velocity', {
        provideDocumentRangeFormattingEdits: (document, range) => {
            let _data = document.getText(range);
            let fixedStart, fixedEnd;
            let output = prettydiff(Object.assign({
                source: _data
            }, formatOptions));

            return [vscode.TextEdit.replace(rangeFactory(range.start, range.end), output)];
        }
    });
    context.subscriptions.push(formatText, formatRange);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;