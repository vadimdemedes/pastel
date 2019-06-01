'use strict';
const path = require('path');
const camelcaseKeys = require('camelcase-keys');
const decamelize = require('decamelize');
const yargs = require('yargs');

module.exports = (dirname, React, Ink, commands) => {
	const addCommand = (command, yargs) => {
		// Yargs expects a special format for positional args when defining a command
		// in order to correctly parse them, e.g. "<first-arg> <second-arg>"
		const positionalArgs = command.args
			.filter(arg => arg.positional)
			.map(arg => `<${decamelize(arg.key, '-')}>`)
			.join(' ');

		const name = command.name === 'index' ? '*' : command.name;
		const yargsName = positionalArgs.length > 0 ? `${name} ${positionalArgs}` : name;
		const description = command.description || `${name} command`;

		// eslint-disable-next-line no-use-before-define
		yargs.command(yargsName, description, builder.bind(null, command), handler.bind(null, command));
	};

	const builder = (command, yargs) => {
		for (const arg of command.args) {
			// `inputArgs` is a reserved prop by Pastel and doesn't require a definition in yargs
			if (arg.key === 'inputArgs') {
				continue;
			}

			if (arg.positional) {
				yargs.positional(decamelize(arg.key, '-'), {
					type: arg.type,
					description: arg.description,
					default: arg.defaultValue
				});
			} else {
				yargs.option(decamelize(arg.key, '-'), {
					type: arg.type,
					description: arg.description,
					default: arg.defaultValue,
					demandOption: arg.isRequired,
					alias: arg.aliases.map(alias => decamelize(alias, '-'))
				});
			}
		}

		for (const subCommand of command.subCommands) {
			addCommand(subCommand, yargs);
		}
	};

	const handler = (command, argv) => {
		const props = {
			...camelcaseKeys(argv),
			inputArgs: argv._
		};

		const UI = require(path.join(dirname, 'commands', command.path)).default;
		const {waitUntilExit} = Ink.render(React.createElement(UI, props));

		waitUntilExit().catch(error => {
			console.error(error.stack);
		});
	};

	for (const command of commands) {
		addCommand(command, yargs);
	}

	yargs.parse();
};
