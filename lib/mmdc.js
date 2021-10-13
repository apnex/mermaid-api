#!/usr/bin/env node
const execSync = require('child_process').execSync;
const hd = require('heredoc');

module.exports = class mmdc {
	constructor(options = {}) {
		this.options = options;
	}

	// methods
	cmd(cmd) {
		return new Promise((resolve, reject) => {
			try {
				console.log(cmd);
		        	execSync(cmd);
				setTimeout(() => {
					resolve(true);
				}, 50);
			} catch(e) {
				if(e.stdout.toString().length > 0) {
					console.log(e.stdout.toString());
				}
				reject(null);
			}
		});
	}
	render(src, dst) {
		return new Promise((resolve, reject) => {
			let spec = hd.strip(function () {/*
				/root/node_modules/.bin/mmdc -p /root/puppeteer-config.json -i <src> -o <dst>*/}
			);
			spec = spec.replace(/<src>/g, src);
			spec = spec.replace(/<dst>/g, dst);
			this.cmd(spec).then((data) => {
				resolve(true);
			});
		});
	};
};
