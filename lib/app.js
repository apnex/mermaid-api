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

app.get("/svg", async(req, res) => {
	console.log('[ GET ] /svg');
	if (!req.query.url) {
		console.log('LOAD: Missing query parameter');
		res.sendStatus(400)
	} else {
		try {
			// download mmd file
			console.log('LOAD: URL query param [ ' + req.query.url + ' ]');
			const response = await got(req.query.url);
			let hash = crypto.createHash('md5').update(response.body).digest('hex');
			fs.writeFileSync('./state/' + hash + '.mmd', response.body, 'utf8');

			// call mmdc and convert
			await mymmdc.render('./state/' + hash + '.mmd', './state/' + hash + '.svg');

			// return file
			res.sendFile('./state/' + hash + '.svg', {
				root: path.join(__dirname)
			});
		} catch(error) {
			console.log(JSON.stringify(error, null, "\t"));
			res.sendStatus(500);
		}
	}
})

app.get("/png", async(req, res) => {
	console.log('[ GET ] /png');
	if (!req.query.url) {
		console.log('LOAD: Missing query parameter');
		res.sendStatus(400)
	} else {
		try {
			// download mmd file
			console.log('LOAD: URL query param [ ' + req.query.url + ' ]');
			const response = await got(req.query.url);
			let hash = crypto.createHash('md5').update(response.body).digest('hex');
			fs.writeFileSync('./state/' + hash + '.mmd', response.body, 'utf8');

			// call mmdc and convert
			await mymmdc.render('./state/' + hash + '.mmd', './state/' + hash + '.png');

			// return file
			res.sendFile('./state/' + hash + '.png', {
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
//app.use('/', express.static(path.join(__dirname, 'html')))
module.exports = {
	api: app
};
