'use strict';
const {promisify} = require('util');
const {join, basename, relative} = require('path');
const fs = require('fs');
const parseCommand = require('./parse-command');

const stat = promisify(fs.stat);

const isIndexCommand = command => command.path.endsWith('index.js');

// `dirPath` is a path in source `commands` folder
// `buildDirPath` is a path to the same folder, but in `build` folder
const readCommands = async (commandsPath, dirPath) => {
	const paths = fs.readdirSync(dirPath);
	const commands = [];

	const promises = paths.map(async path => {
		// Since `readdir` returns relative paths, we need to transform them to absolute paths
		const fullPath = join(dirPath, path);
		const stats = await stat(fullPath);

		if (stats.isDirectory()) {
			const subCommands = await readCommands(commandsPath, fullPath);
			const indexCommand = subCommands.find(isIndexCommand);

			commands.push({
				...indexCommand,
				name: path,
				subCommands: subCommands.filter(command => !isIndexCommand(command))
			});
		}

		if (stats.isFile()) {
			const {description, args} = await parseCommand(fullPath);

			commands.push({
				path: relative(commandsPath, fullPath),
				name: basename(fullPath, '.js'),
				description,
				args,
				subCommands: []
			});
		}
	});

	await Promise.all(promises);

	return commands;
};

module.exports = readCommands;
