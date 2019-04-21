'use strict';

const getEntrypointPaths = commands => {
	const entrypointPaths = [];

	for (const command of commands) {
		entrypointPaths.push(command.path);
		entrypointPaths.push(...getEntrypointPaths(command.subCommands));
	}

	return entrypointPaths;
};

module.exports = getEntrypointPaths;
