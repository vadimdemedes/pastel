'use strict';
const path = require('path');
const camelcaseKeys = require('camelcase-keys');
const decamelize = require('decamelize');
const yargs = require('yargs');

const getCommandsMessage = command => {
	const usageString = [...command.usage, command.name].join(' ');
	return `Commands:\n${command.subCommands.map(subCommand => `  ${usageString} ${subCommand.name}`).join('\n')}\n`;
};

module.exports = (dirname, React, Ink, originalCommands) => {
	let commands = originalCommands;

	// For backwards compatibility for builds made with versions prior to 1.1.0 that don't include positionalArgs
	if (originalCommands.some(command => !command.positionalArgs && (command.args || []).some(arg => arg.positional))) {
		commands = originalCommands.map(command => ({
			...command,
			positionalArgs: (command.args || []).filter(arg => arg.positional).map(arg => arg.key)
		}));
	}

	const addCommand = (command, yargs) => {
		// Don't need to add a description as it'll be handled by the * selector in the builder
		// eslint-disable-next-line no-use-before-define
		yargs.command(command.name, '', builder.bind(null, command), () => yargs.showHelp());
	};

	const handler = (command, argv) => {
		const props = {
			...camelcaseKeys(argv),
			inputArgs: argv._
		};

		const UI = require(path.join(dirname, 'commands', command.path.replace('.tsx', '.js'))).default;
		const {waitUntilExit} = Ink.render(React.createElement(UI, props));

		waitUntilExit().catch(error => {
			console.error(error.stack);
		});
	};

	const builder = (command, yargs) => {
		const {
			positionalArgs = [],
			args,
			description,
			name,
			subCommands,
			isDefaultIndex,
			usage
		} = command;

		for (const subCommand of subCommands) {
			addCommand({
				...subCommand,
				usage: [...usage, name]
			}, yargs);
		}

		// If there is no index defined, yargs will just list the sub-commands
		if (isDefaultIndex) {
			return;
		}

		const hasPositionalArgs = positionalArgs.length > 0;
		const positionalArgsString = positionalArgs.map(key => {
			const {isRequired, type, aliases} = args.find(arg => arg.key === key);
			const [startTag, endTag] = isRequired ? ['<', '>'] : ['[', type === 'array' ? '..]' : ']'];
			const argsNames = [key, ...aliases.slice(0, 1)].map(name => decamelize(name, '-')).join('|');

			return `${startTag}${argsNames}${endTag}`;
		}).join(' ');

		const yargsName = hasPositionalArgs ? `* ${positionalArgsString}` : '*';
		const commandDescription = description || `${name} command`;

		yargs.command(yargsName, commandDescription, scopedYargs => {
			for (const arg of command.args) {
				// `inputArgs` is a reserved prop by Pastel and doesn't require a definition in yargs
				if (arg.key === 'inputArgs') {
					continue;
				}

				if (arg.positional) {
					scopedYargs.positional(decamelize(arg.key, '-'), {
						type: arg.type,
						description: arg.description,
						default: arg.defaultValue,
						// This only keeps one for some reason for positional arguments
						// The slice ensures we keep the same as the one we add in the command
						alias: arg.aliases.slice(0, 1).map(alias => decamelize(alias, '-'))
					});
				} else {
					scopedYargs.option(decamelize(arg.key, '-'), {
						type: arg.type,
						description: arg.description,
						default: arg.defaultValue,
						demandOption: arg.isRequired,
						alias: arg.aliases.map(alias => decamelize(alias, '-'))
					});
				}
			}

			// If the index command takes no arguments and there are available sub-commands,
			// list the sub-commands in the help message.
			if (!hasPositionalArgs && subCommands.length > 0) {
				const usageMessage = getCommandsMessage(command);
				scopedYargs.demandCommand(0, 0, usageMessage, usageMessage);
			}
		}, handler.bind(null, command));
	};

	yargs.command(
		'*', '',
		yargs => {
			const usage = [path.basename(yargs.$0)];
			for (const command of commands) {
				addCommand({...command, usage}, yargs);
			}
		},
		() => yargs.showHelp()
	);

	yargs.parse();
};
