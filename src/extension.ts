'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {getFile,createFile} from './pathFactory';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autocreatefile" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.goTo', () => {

        const editor = vscode.window.activeTextEditor;
        const selection = editor.selection;
        const selectLineNum = selection.start.line;
        const lineText = editor.document.lineAt(selectLineNum).text;
        const rootPath = editor.document.uri.fsPath;
        const filePath = getFile(lineText,rootPath);
        if(!filePath) return;
        if(filePath.exist) {
            vscode.workspace.openTextDocument(filePath.file).then(doc => vscode.window.showTextDocument(doc))
        }else {
            vscode.window.showErrorMessage("没有该文件",{
                "title":"创建新文件"
            }).then(function(res){
                if(res.title=="创建新文件") {
                    createFile(filePath.file)
                    vscode.workspace.openTextDocument(filePath.file).then(doc => vscode.window.showTextDocument(doc))
                }
            });
            
        }
        
    });
   
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}