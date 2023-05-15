import fs from 'node:fs/promises';
import path from 'node:path';
import {Command} from './types.js';

const readCommands = async (
	directory: string,
): Promise<Map<string, Command>> => {
	const commands = new Map<string, Command>();
	const files = await fs.readdir(directory);

	for (const file of files) {
		const filePath = path.join(directory, file);
		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			const subCommands = await readCommands(filePath);
			const indexCommand = subCommands.get('index');

			if (indexCommand) {
				indexCommand.name = file;
				indexCommand.commands = subCommands;
				subCommands.delete('index');
				commands.set(file, indexCommand);
				continue;
			}

			const command: Command = indexCommand ?? {
				name: file,
				isDefault: false,
				commands: subCommands,
			};

			commands.set(file, command);
			continue;
		}

		if (!/\.(js|ts)x?$/.test(file)) {
			continue;
		}

		const m = await import(filePath);
		const name = file.replace(/\.(js|ts)x?$/, '');

		commands.set(name, {
			name,
			description: m.description,
			isDefault: m.isDefault ?? false,
			options: m.options,
			positionalArguments: m.positionalArguments,
			component: m.default,
		});
	}

	return commands;
};

export default readCommands;
