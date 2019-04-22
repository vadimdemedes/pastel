'use strict';
const path = require('path');
const fs = require('fs');
const stripIndent = require('strip-indent');
const wrapAnsi = require('wrap-ansi');
const cardinal = require('cardinal');
const figures = require('figures');
const chalk = require('chalk');

const fail = (title, description) => {
	const wrappedDescription = wrapAnsi(stripIndent(description).trim(), 80, {trim: false});
	console.log(`${chalk.red(figures.cross)} ${title}\n\n${wrappedDescription}`);
	process.exit(1); // eslint-disable-line unicorn/no-process-exit
};

module.exports = (projectPath, pkg) => {
	if (!pkg.name) {
		fail('Field "name" in package.json is empty or missing', `
			Without "name" field it's not possible to run your CLI. Value of "name" field matches the name of command.

			For example, in package.json:
			${cardinal.highlight(`{
			  "name": "my-awesome-cli"
			}`)}

			Then in terminal:
			${chalk.yellow('$')} ${chalk.green('my-awesome-cli')} --help

			${chalk.dim('Learn more at https://docs.npmjs.com/files/package.json#name')}
		`);
	}

	if (!pkg.bin) {
		fail('Field "bin" in package.json is empty or missing', `
			Field "bin" is required to create an executable command for your CLI. Add "bin" field to your package.json file like so:

			${cardinal.highlight(`{
			  "bin": "./build/cli.js"
			}`)}

			${chalk.bold('Note:')} It has to equal "./build/cli.js", because that's how Pastel is initialized.

			${chalk.dim('Learn more at https://docs.npmjs.com/files/package.json#bin')}
		`);
	}

	if (!fs.existsSync(path.join(projectPath, 'commands'))) {
		fail('Directory "commands" is missing', `
			Pastel requires "commands" directory to exist in the root of your application, because that's where it looks for your commands.

			Create a "commands" directory like this:

			${chalk.yellow('$')} ${chalk.green('mkdir')} commands
		`);
	}

	const commands = fs.readdirSync(path.join(projectPath, 'commands'));
	if (commands.length === 0) {
		fail('Commands were not found', `
			Pastel requires at least one command to exist in "commands" directory. Create an "index.js" file in "commands" directory and paste this example code:

			${cardinal.highlight(`
			import React from 'react';
			import {Text} from 'ink';

			const HelloWorld = () => <Text>Hello World</Text>;

			export default HelloWorld;
			`.trim(), {jsx: true})}

			After you've done that, run this command again.
		`);
	}
};
