import * as vscode from "vscode";

let customTypes: string[] = [];

export function activate(context: vscode.ExtensionContext) {
  console.log("CD24-Syntax-Highlighting extension is now active!");

  let disposable = vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === "cd24") {
      updateCustomTypes(event.document);
      updateDecorations(event.document);
    }
  });

  context.subscriptions.push(disposable);

  // Initial update for all open CD24 documents
  vscode.workspace.textDocuments.forEach((document) => {
    if (document.languageId === "cd24") {
      updateCustomTypes(document);
      updateDecorations(document);
    }
  });
}

function updateCustomTypes(document: vscode.TextDocument) {
  customTypes = [];
  const text = document.getText();
  const lines = text.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*(\w+)\s+def\s*$/);
    if (match) {
      customTypes.push(match[1]);
    }
  }
  console.log("Updated custom types:", customTypes);
}

const customTypeDecorationType = vscode.window.createTextEditorDecorationType({
  color: "#4EC9B0", // Place holder colour
});

function updateDecorations(document: vscode.TextDocument) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document !== document) {
    return;
  }

  const decorations: vscode.DecorationOptions[] = [];
  const text = document.getText();

  customTypes.forEach((type) => {
    const regEx = new RegExp(`\\b${type}\\b`, "g");
    let match;
    while ((match = regEx.exec(text))) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const decoration = { range: new vscode.Range(startPos, endPos) };
      decorations.push(decoration);
    }
  });

  editor.setDecorations(customTypeDecorationType, decorations);
}

export function deactivate() {}
