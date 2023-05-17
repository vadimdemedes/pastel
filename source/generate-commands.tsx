import {Command as CommanderCommand} from 'commander';
import {type ComponentType} from 'react';
import type {Command} from './internal-types.js';
import generateCommand from './generate-command.js';
import {type AppProps} from './types.js';

const generateCommands = (
	parentCommanderCommand: CommanderCommand,
	pastelCommands: Map<string, Command>,
	{appComponent}: {appComponent: ComponentType<AppProps>},
) => {
	if (pastelCommands.size > 0) {
		parentCommanderCommand.addHelpCommand(
			'help [command]',
			'Show help for command',
		);
	}

	for (const [name, pastelCommand] of pastelCommands) {
		const commanderCommand = new CommanderCommand(name);
		generateCommand(commanderCommand, pastelCommand, {appComponent});

		if (pastelCommand.commands) {
			generateCommands(commanderCommand, pastelCommand.commands, {
				appComponent,
			});
		}

		parentCommanderCommand.addCommand(commanderCommand, {
			isDefault: pastelCommand.isDefault,
		});
	}
};

export default generateCommands;
