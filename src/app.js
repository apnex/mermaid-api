#!/usr/bin/env node
const got = require('got');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// initialise app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// encode
function inkEncode(mmdRaw) {
	let mmdEncoded = Buffer.from(JSON.stringify({
		code: mmdRaw,
		mermaid: {
			theme: 'default'
		}
	})).toString('base64');
	return encodeURIComponent(mmdEncoded);
}

app.get("/jpg", async(req, res) => {
	if(req.query.url) { // check ?url=
		let type = 'svg';
		res.set('Content-Type', 'image/svg+xml');
		if(req.query.type && req.query.type == 'jpg') { // check ?type=
			type = 'img';
			res.set('Content-Type', 'image/jpeg');
		}
		try {
			let mmdRes = await got(req.query.url); // load mmd
			got.stream('https://mermaid.ink/' + type + '/' + inkEncode(mmdRes.body)).pipe(res);
		} catch(error) {
			res.set('Content-Type', 'text/plain');
			res.status(500).send('Error: mmd load failed for [' + req.query.url + ']');
		}
	} else {
		res.set('Content-Type', 'text/plain');
		res.status(404).send('Error: No <url> query param specified!');
	}
});

app.get('/favicon.ico', (req, res) => {
	res.status(200).send({});
});

// Serve static html files
//app.use('/', express.static(path.join(__dirname, 'html')))
module.exports = {
	api: app
};
