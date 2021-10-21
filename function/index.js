const got = require('got');

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

exports.mmdRender = async(req, res) => {
	if(req.query.url) { // check ?url=
		let type = 'svg';
		res.type('image/svg+xml');
		if(req.query.type && req.query.type == 'png') { // check ?type=
			type = 'img';
			res.type('image/png');
		}
		try {
			let response = await got(req.query.url); // load mmd
			let imgBody = await inkRender(response.body, type); // render svg
			res.status(200).send(imgBody);
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
