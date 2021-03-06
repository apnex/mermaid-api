#!/usr/bin/env node
const got = require('got');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mmdc = require('./mmdc');
var mymmdc = new mmdc();

// initialise app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// retrieve all data
app.get('/test', (req, res) => {
	console.log('[ GET ] /schema');
	console.log(JSON.stringify(req.query, null, "\t"));
	res.status(200).send({});
});

async function inkRender(mmdRaw, type = 'svg') {
	let mmdEncoded = Buffer.from(JSON.stringify({
		code: mmdRaw,
		mermaid: {
			theme: 'default'
		}
	})).toString('base64');
	let url = 'https://mermaid.ink/' + type + '/' + encodeURIComponent(mmdEncoded);
	let response = await got(url);
	return response.body;
}

app.get("/jpg", async(req, res) => {
	if(req.query.url) { // check ?url=
		try {
			let response = await got(req.query.url); // load mmd
			let imgBody = await inkRender(response.body, type); // render svg
			res.type('image/jpg');
			res.status(200).send(imgBody, 'Base64');
		} catch(error) {
			console.log(JSON.stringify(error, null, "\t"));
			res.type('text/plain');
			res.sendStatus(500);
		}
	} else {
		res.type('text/plain');
		res.status(404).send('Error: No <url> query param specified!');
	}
};

app.get('/favicon.ico', (req, res) => {
	res.status(200).send({});
});

// Serve static html files
//app.use('/', express.static(path.join(__dirname, 'html')))
module.exports = {
	api: app
};
