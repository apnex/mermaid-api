#!/usr/bin/env node
const app = require('./app');
'use strict';

// get environment variable
var port = process.env.PORT || 80;

// start server
app.api.listen(port, () => {
	console.log('Express server listening on port ' + port);
	//mainLoop();
});

// main control loop
async function mainLoop() {
	console.log('[ SERVER ] initiating mainLoop()');
	let i = 0;
	while (true) {
		//checkPaths(app.state);
		await msleep(2000);
		i++;
	}
}

function msleep(ms) {
        return new Promise((response) => {
                setTimeout(response, ms)
        });
}
