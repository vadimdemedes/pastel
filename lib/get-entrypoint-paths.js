'use strict';
const path = require('path');

// This function extracts all command paths into a flat array
const getEntrypointPaths = (commandsPath, commands) => {
	const entrypointPaths = [];

	for (const command of commands) {
		entrypointPaths.push(path.join(commandsPath, command.path));
		entrypointPaths.push(...getEntrypointPaths(commandsPath, command.subCommands));
	}

	return entrypointPaths;
};

module.exports = getEntrypointPaths;
