'use strict';
const {promisify} = require('util');
const path = require('path');
const fs = require('fs');
const Bundler = require('parcel-bundler');
const readCommands = require('./lib/read-commands');
const getEntrypointPaths = require('./lib/get-entrypoint-paths');
const parseCommand = require('./lib/parse-command');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

exports.build = async (appPath, {watch}) => {
	const commandsPath = path.join(appPath, 'commands');
	const buildPath = path.join(appPath, 'build');
	const cachePath = path.join(appPath, 'node_modules', '.cache', 'parcel');

	const commands = await readCommands(commandsPath, path.join(buildPath, 'commands'));
	const entrypointPaths = getEntrypointPaths(commands);

	const bundler = new Bundler(entrypointPaths, {
		outDir: path.join(buildPath, 'commands'),
		cacheDir: cachePath,
		target: 'node',
		watch,
		logLevel: 0
	});

	const save = async () => {
		await writeFile(path.join(buildPath, 'cli.js'), await readFile(path.join(__dirname, 'pastel-entry.js')));
		await chmod(path.join(buildPath, 'cli.js'), 0o777);
		await writeFile(path.join(buildPath, 'commands.json'), JSON.stringify({ commands }, null, '\t'));
	};

	if (watch) {
		bundler.on('buildEnd', save);
	}

	await bundler.bundle();

	if (!watch) {
		await save();
	}
};
