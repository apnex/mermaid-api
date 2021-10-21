#!/usr/bin/env node
const fs = require('fs');
const got = require('got');

//console.log(mycode);
//var result = mdecode(mycode);
//console.log(result);

/*
var newstr = 'graph TD\n' +
    '    A[Christmas] -->|Get money| B(Go shopping)\n' +
    '    B --> C{Let me think}\n' +
    '    C -->|One| D[Laptop]\n' +
    '    C -->|Two| E[MOO]\n' +
    '    C -->|Three| F[fa:fa-car Car]\n' +
    '    C -->|Four| G(TEST)'
*/
/*
var newstr = 'sequenceDiagram\n' +
	'	Alice->>+John: Hello John, how are you?\n' +
	'	Alice->>+John: John, can you hear me?\n' +
	'	John-->>-Alice: Hi Alice, I can hear you!\n' +
	'	John-->>-Alice: I feel great!';
*/
var newstr = 'sequenceDiagram\n' +
	'	Alice->>+John: J?ohn, can you hear me\n' +
	'	Alice->>+John: Hello John, how are you me\n' +
	'	Alice->>+John: John, can you hear mr';

//var filecode = fs.readFileSync('./examples/sequence.mmd').toString('utf8');
var filecode = fs.readFileSync('./string.txt').toString('utf8');
//let modifiedstr = newstr.replace('?', '%3F');
//console.log(modifiedstr);
//console.log(filecode);
let durl = 'https://mermaid.ink/svg/' + filecode;
console.log(durl);

let decoded = mdecode(filecode);
console.log(decoded);

let encoded = mencode(decoded);
let url = 'https://mermaid.ink/svg/' + encodeURIComponent(encoded);
console.log(url);

/*
start(modifiedstr);
async function start(raw) {
	console.log(await svgRender(raw));
}
*/
/*
var spec = {
	//code: newstr,
	code: filecode,
	mermaid: {
		theme: 'default'
	}
};
console.log(filecode);
var url = 'https://mermaid.ink/svg/' + mencode(JSON.stringify(spec));
console.log(url);
*/

function mdecode(base64) {
	const str = Buffer.from(base64, 'base64').toString('ascii');

	/*
	let state;
	try {
		let moot = JSON.parse(str);
		state = {
			code: moot.code,
			mermaid: { theme }
		};
	} catch (e) {
		state = { code: str, mermaid: { theme } };
	}
	*/
	return str;
};

function mencode(raw) {
	//let buff = new Buffer(JSON.stringify(raw));
	let str = Buffer.from(raw).toString('base64');
	//let str = buff.toString('base64');
	return str;
};

async function svgRender(mmdRaw) {
	let jsonEncoded = JSON.stringify({
		code: mmdRaw,
		mermaid: {
			theme: 'default'
		}
	});
	console.log(jsonEncoded);
	let mmdEncoded = Buffer.from(jsonEncoded).toString('base64');
	let url = 'https://mermaid.ink/svg/' + encodeURIComponent(mmdEncoded);
	let response = await got(url);
	return response.body;
}
