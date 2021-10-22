const got = require('got');
function inkEncode(mmdRaw) {
	return encodeURIComponent(Buffer.from(JSON.stringify({
		code: mmdRaw,
		mermaid: {
			theme: 'default'
		}
	})).toString('base64'));
}
exports.mmdRender = async(req, res) => {
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
};
