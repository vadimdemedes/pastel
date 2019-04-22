'use strict';
const stripIndent = require('strip-indent');
const wrapAnsi = require('wrap-ansi');
const chalk = require('chalk');

module.exports = () => {
	console.log(wrapAnsi(stripIndent(`
		${chalk.bold('Welcome to Pastel!')}

		Pastel has 2 commands:

		${chalk.dim('-')} ${chalk.bold('build')} - Build application for distribution
		${chalk.dim('-')} ${chalk.bold('dev')} - Start development mode

		Use ${chalk.bold('dev')} command to develop your application, which watches for changes and recompiles your CLI when they happen. Use ${chalk.bold('build')} to create a production version of your CLI, ready to be distributed via a CLI.

		Happy coding!
	`).trim(), 80));
};
