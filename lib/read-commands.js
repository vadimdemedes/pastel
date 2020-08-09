'use strict';
const {promisify} = require('util');
const {join, relative, extname, parse} = require('path');
const fs = require('fs');
const parseCommand = require('./parse-command');

const stat = promisify(fs.stat);

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
			const indexCommand = subCommands.find(command => command.isIndex) || {
				isDefaultIndex: true
			};

			commands.push({
				...indexCommand,
				isIndex: false,
				name: path,
				subCommands: subCommands.filter(command => !command.isIndex)
			});
		}

		if (stats.isFile() && ['.js', '.tsx'].includes(extname(fullPath))) {
			const command = await parseCommand(fullPath);
			const {name} = parse(fullPath);
			const isIndex = name === 'index';

			commands.push({
				...command,
				isIndex,
				name: isIndex ? '*' : name,
				path: relative(commandsPath, fullPath),
				subCommands: []
			});
		}
	});

	await Promise.all(promises);

	return commands;
};

module.exports = readCommands;
