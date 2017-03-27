import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as clip from 'node-clipboard';

export function activate(context: vscode.ExtensionContext) {

    let copyPath = vscode.commands.registerCommand('extension.copyPath', (fileUri ? : vscode.Uri) => {

        let fileName = '';
        if (fileUri && fileUri.fsPath) {
            fileName = fileUri.fsPath;
        } else {
            if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document) {
                return;
            }
            fileName = vscode.window.activeTextEditor.document.fileName;
        }

        let config = vscode.workspace.getConfiguration('goTo');

        if (!config.rootPath) {
            let options: vscode.InputBoxOptions = {
                ignoreFocusOut: true,
                placeHolder: "Enter the webapp root base",
                prompt: "Example : src/main/webapp "

            };
            vscode.window.showInputBox(options).then(async(res) => {
                if (res) {
                    if ((fs.existsSync(path.join(vscode.workspace.rootPath, res)))) {
                        config.update("rootPath", res, true).then(function () {
                            vscode.window.showInformationMessage("setting webapp rootPath  success , retry it")
                        })
                    } else {
                        vscode.window.showErrorMessage("no such folder")
                    }
                }
            })
        } else {
            const relativePath = path.relative(path.join(vscode.workspace.rootPath,config.rootPath),fileName);
            clip(relativePath,function(e){
                if(e) {
                    vscode.window.showInformationMessage(relativePath)
                    vscode.window.showInformationMessage("copy error! please copy it by yourself ")
                    return
                }
                vscode.window.showInformationMessage("copy success")
                
            })
            
        }
    });

    context.subscriptions.push(copyPath);
}