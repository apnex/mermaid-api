#!/usr/bin/env node
const fs = require('fs');

//console.log(mycode);

//var result = mdecode(mycode);
//console.log(result);

var newstr = 'graph TD\n' +
    '    A[Christmas] -->|Get money| B(Go shopping)\n' +
    '    B --> C{Let me think}\n' +
    '    C -->|One| D[Laptop]\n' +
    '    C -->|Two| E[MOO]\n' +
    '    C -->|Three| F[fa:fa-car Car]\n' +
    '    C -->|Four| G(TEST)'

var filecode = fs.readFileSync('./examples/labs4.mmd').toString('utf8');
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

function mdecode(base64) {
	const theme = 'default';
	const str = Buffer.from(base64, 'base64').toString('utf8');
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
	return state;
};

function mencode(raw) {
	//let buff = new Buffer(JSON.stringify(raw));
	let str = Buffer.from(raw).toString('base64');
	//let str = buff.toString('base64');
	return str;
};
