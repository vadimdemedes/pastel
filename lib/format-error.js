'use strict';
const chalk = require('chalk');

module.exports = error => {
	// If there's no `highlightedCodeFrame` property, this is not a Parcel error
	if (!error.highlightedCodeFrame) {
		return `\n${error.stack}\n`;
	}

	return [
		`\n${error.message}`,
		chalk.dim(error.fileName),
		`\n${error.highlightedCodeFrame}\n`
	].join('\n');
};
