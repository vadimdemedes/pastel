#!/usr/bin/env node
'use strict';
const React = require('react');
const {render} = require('ink');
const yargs = require('yargs');
const {commands} = require('./commands.json');

const builder = (command, yargs) => {
	for (const arg of command.args) {
		if (arg.positional) {
			yargs.positional(arg.key, {
				type: arg.type,
				description: arg.description,
				default: arg.defaultValue
			});
		} else {
			yargs.option(arg.key, {
				type: arg.type,
				description: arg.description,
				default: arg.defaultValue,
				demandOption: arg.isRequired,
				alias: arg.aliases
			});
		}
	}

	for (const subCommand of command.subCommands) {
		addCommand(subCommand, yargs);
	}
};

const addCommand = (command, yargs) => {
	const positionalArgs = command.args
		.filter(arg => arg.positional)
		.map(arg => `<${arg.key}>`)
		.join(' ');

	const name = command.name === 'index' ? '*' : command.name;
	const yargsName = positionalArgs.length > 0 ? `${name} ${positionalArgs}` : name;
	const description = command.description || `${name} command`;

	yargs.command(yargsName, description, builder.bind(null, command), handler.bind(null, command));
}

const handler = (command, argv) => {
	const UI = require(command.buildPath).default;
	render(React.createElement(UI, argv));
};

for (const command of commands) {
	addCommand(command, yargs);
}

yargs.parse();
