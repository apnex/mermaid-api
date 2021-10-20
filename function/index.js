const got = require('got');

async function svgRender(mmdRaw) {
	let mmdEncoded = Buffer.from(JSON.stringify({
		code: mmdRaw,
		mermaid: {
			theme: 'default'
		}
	})).toString('base64');
	let url = 'https://mermaid.ink/svg/' + mmdEncoded;
	let response = await got(url);
	return response.body;
}

exports.mmdRender = async(req, res) => {
	if(req.query.url) { // check ?url=
		try {
			let response = await got(req.query.url); // load mmd
			let svgBody = await svgRender(response.body); // render svg
			res.type('image/svg+xml');
			res.status(200).send(svgBody);
		} catch(error) {
			console.log(JSON.stringify(error, null, "\t"));
			res.sendStatus(500);
		}
	} else {
		res.type('image/svg+xml');
		res.status(404).send('Error: No <url> query param specified!');
	}
};
