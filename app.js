#!/usr/bin/env node
//'use strict';
const got = require('got');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');
const path = require('path');
const mmdc = require('./mmdc');

mymmdc = new mmdc();

// initialise app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// retrieve all data
app.get('/svg', (req, res) => {
	console.log('[ GET ] /schema');

	console.log(JSON.stringify(req.query, null, "\t"));

	res.status(200).send({});
});

app.get("/load", async(req, res) => {
	console.log('[ GET ] /load');
	if (!req.query.url) {
		console.log('LOAD: Missing query parameter');
		res.sendStatus(400)
	} else {
		try {
			// download mmd file
			console.log('LOAD: URL query param [ ' + req.query.url + ' ]');
			const response = await got(req.query.url);
			fs.writeFileSync('./state/src.mmd', response.body, 'utf8');

			// call mmdc and convert
			await mymmdc.render('./state/src.mmd', './state/dst.svg');

			// return file
			res.sendFile('./state/dst.svg', {
				root: path.join(__dirname)
			});
		} catch(error) {
			console.log(JSON.stringify(error, null, "\t"));
			res.sendStatus(500);
		}
	}
})

app.get('/favicon.ico', (req, res) => {
	res.status(200).send({});
});

// Serve static html files
app.use('/', express.static(path.join(__dirname, 'html')))
module.exports = {
	api: app
};
