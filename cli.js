#!/usr/bin/env node
'use strict';
const stripIndent = require('strip-indent');
const figures = require('figures');
const chalk = require('chalk');
const yargs = require('yargs');
const build = require('./commands/build');
const dev = require('./commands/dev');
const index = require('./commands');

// Since yargs doesn't supports async functions as command handlers, we need
// to catch errors coming out of them and log them
const wrap = handler => {
	return (...args) => {
		handler(...args).catch(error => {
			const message = stripIndent(`
				${chalk.red(figures.cross)} Unexpected error occurred

				Please copy the following stacktrace and report this error at https://github.com/vadimdemedes/pastel/issues/new:
			`).trim();

			console.log(`${message}\n\n${chalk.dim(error.stack)}`);
			process.exit(1);
		});
	};
};

yargs
	.option('test-mode', {
		type: 'boolean',
		default: false
	})
	.command('dev', 'Start application in development mode', () => {}, wrap(dev))
	.command('build', 'Build application for production', () => {}, wrap(build))
	.command('*', false, () => {}, index)
	.parse();
