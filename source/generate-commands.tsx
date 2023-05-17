import {Command as CommanderCommand} from 'commander';
import type {Command} from './internal-types.js';
import generateCommand from './generate-command.js';
import {ComponentType} from 'react';
import {AppProps} from './types.js';

const generateCommands = (
	parentCommanderCommand: CommanderCommand,
	pastelCommands: Map<string, Command>,
	{AppComponent}: {AppComponent: ComponentType<AppProps>},
) => {
	if (pastelCommands.size > 0) {
		parentCommanderCommand.addHelpCommand(
			'help [command]',
			'Show help for command',
		);
	}

	for (const [name, pastelCommand] of pastelCommands) {
		const commanderCommand = new CommanderCommand(name);
		generateCommand(commanderCommand, pastelCommand, {AppComponent});

		if (pastelCommand.commands) {
			generateCommands(commanderCommand, pastelCommand.commands, {
				AppComponent,
			});
		}

		parentCommanderCommand.addCommand(commanderCommand, {
			isDefault: pastelCommand.isDefault,
		});
	}
};

export default generateCommands;
