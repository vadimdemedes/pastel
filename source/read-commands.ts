import fs from 'node:fs/promises';
import path from 'node:path';
import decamelize from 'decamelize';
import type {CommandExports, Command} from './internal-types.js';

const readCommands = async (
	directory: string,
): Promise<Map<string, Command>> => {
	const commands = new Map<string, Command>();
	const files = await fs.readdir(directory);

	for (const file of files) {
		if (file.startsWith('_app')) {
			continue;
		}

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

		const m = (await import(filePath)) as CommandExports;
		const name = decamelize(file.replace(/\.(js|ts)x?$/, ''), {separator: '-'});

		commands.set(name, {
			name,
			description: m.description,
			isDefault: m.isDefault ?? false,
			alias: m.alias,
			options: m.options,
			args: m.args,
			component: m.default,
		});
	}

	return commands;
};

export default readCommands;
