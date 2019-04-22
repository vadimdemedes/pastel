'use strict';
const path = require('path');
const stripIndent = require('strip-indent');
const readPkgUp = require('read-pkg-up');
const wrapAnsi = require('wrap-ansi');
const figures = require('figures');
const ora = require('ora');
const chalk = require('chalk');
const lint = require('../lib/lint');
const linkBin = require('../lib/link-bin');
const formatError = require('../lib/format-error');
const states = require('../lib/states');
const Pastel = require('..');

module.exports = async () => {
	const {pkg, path: pkgPath} = readPkgUp.sync();
	const projectPath = path.dirname(pkgPath);

	lint(projectPath, pkg);

	console.log(wrapAnsi(stripIndent(`
		${chalk.bold('Development mode')}

		Pastel watches your "commands" directory for changes and rebuilds application when needed. After first successful build Pastel will also link your CLI for you, so feel free to run your command right away:

		${chalk.yellow('$')} ${chalk.green(pkg.name)} --help

		Now go create some beautiful CLI!
	`), 80).trim() + '\n');

	let status = ora(states.BUILDING).start();
	const pastel = new Pastel(projectPath);

	try {
		await pastel.build();
	} catch (error) {
		status.fail(states.ERROR);
		console.log(formatError(error));
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}

	try {
		states.text = states.LINKING;
		await linkBin(projectPath);
	} catch (error) {
		status.fail(states.ERROR);
		console.log(formatError(error));
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}

	let isLastBuildFailed = false;

	const onStart = () => {
		if (!status.isSpinning) {
			status = ora(states.BUILDING).start();
			return;
		}

		status.text = states.BUILDING;
	};

	const onFinish = () => {
		// If last build has failed, but current one succeeded,
		// display a success message to assure user that they fixed the issue
		if (isLastBuildFailed) {
			status.stop();
			console.log(`${chalk.green(figures.tick)} ${states.SUCCESS}\n`);
			status.start();
			isLastBuildFailed = false;
		}

		status.text = states.WATCHING;
	};

	const onError = error => {
		status.fail(states.ERROR);
		console.log(formatError(error));
		onStart();
		status.text = states.WATCHING;
		isLastBuildFailed = true;
	};

	try {
		await pastel.watch({onStart, onFinish, onError});
	} catch (error) {
		onError(error);
	}
};
