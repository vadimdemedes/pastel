'use strict';
const {promisify} = require('util');
const {join, basename} = require('path');
const fs = require('fs');
const parseCommand = require('./parse-command');

const stat = promisify(fs.stat);

const isIndexCommand = command => command.path.endsWith('index.js')

const readCommands = async (dirPath, buildPath) => {
	const paths = fs.readdirSync(dirPath);
	const commands = [];

	for (const path of paths) {
		const fullPath = join(dirPath, path);
		const stats = await stat(fullPath);

		if (stats.isDirectory()) {
			const subCommands = await readCommands(fullPath, join(buildPath, path));
			const indexCommand = subCommands.find(isIndexCommand)

			commands.push({
				...indexCommand,
				name: path,
				subCommands: subCommands.filter(command => !isIndexCommand(command))
			})
		}

		if (stats.isFile()) {
			const {description, args} = await parseCommand(fullPath);

			commands.push({
				path: fullPath,
				buildPath: join(buildPath, path),
				name: basename(fullPath, '.js'),
				description,
				args,
				subCommands: []
			})
		}
	}

	return commands
};

module.exports = readCommands;
