import * as vscode from 'vscode';
import {getFile,createFile} from '../pathFactory';

export function activate(context: vscode.ExtensionContext) {
    let goTo = vscode.commands.registerCommand('extension.goTo', () => {

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

    context.subscriptions.push(goTo);
}