import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.quickpicksnippets', () => {

	let grpArray :any = [[],[]];
	let nmArray  :any = [[]];
	let snptArray :any = [[]];
	let nakedSnpCount = 0;
	let conf : any = vscode.workspace.getConfiguration('quickpicksnippets').get('snippets');

	for(let i =0;;i++){
		if(conf[i] === undefined){break;}
		let keys = Object.keys(conf[i]);
		let values = Object.values(conf[i]);
		let gNum = keys.indexOf('group');
		let nNum = keys.indexOf('name');
		let sNum = keys.indexOf('snippet');
		let snpt = values[sNum];
		let name = values[nNum];
		let group = values[gNum];
		if (sNum === -1){snpt = '';}
		if(sNum === -1){name = snpt;}
		if (gNum === -1 ){
			grpArray[0].push(name);
			snptArray[0].push(snpt);
			nakedSnpCount++;
		}
		else {
			let grpIndex = grpArray[1].indexOf('group: ' + group);
			if (grpIndex === -1){
			grpArray[1].push('group: ' + group);
			nmArray.push(new Array(name));
			snptArray.push(new Array(snpt));
			}
			else {
				nmArray[grpIndex + 1].push(name);
				snptArray[grpIndex + 1].push(snpt);
			}

		}
		
		}
	let finalGrpArray = grpArray[0].concat(grpArray[1]);
	vscode.window.showQuickPick(finalGrpArray).then((value) =>{
		let x = finalGrpArray.indexOf(value);
		if(x < nakedSnpCount){final(0,x);}
		else{
			x = x + 1 - nakedSnpCount;
			vscode.window.showQuickPick(nmArray[x]).then((value) =>{
			let y = nmArray[x].indexOf(value);
			final(x,y);
			},(error: any) => vscode.window.showErrorMessage(error));
		}
	},(error: any) => vscode.window.showErrorMessage(error));

	function final(arrayNum: number, stringNum:number) {
		let str = snptArray[arrayNum][stringNum];
		let snippet = new vscode.SnippetString(str);
		const editor = vscode.window.activeTextEditor;
		if(editor){
		editor.insertSnippet(snippet);
		}
	
	}


		});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

