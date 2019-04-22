#!/usr/bin/env node
'use strict';
const path = require('path');
const readPkgUp = require('read-pkg-up');
const ora = require('ora');
const lint = require('../lib/lint');
const formatError = require('../lib/format-error');
const states = require('../lib/states');
const Pastel = require('..');

module.exports = async ({testMode}) => {
	const {pkg, path: pkgPath} = readPkgUp.sync();
	const projectPath = path.dirname(pkgPath);

	lint(projectPath, pkg);

	const status = ora(states.BUILDING).start();
	const pastel = new Pastel(projectPath, {testMode});

	try {
		await pastel.build();
		status.succeed(states.SUCCESS);
	} catch (error) {
		status.fail(states.ERROR);
		console.log(formatError(error));
		process.exit(1);
	}
};
