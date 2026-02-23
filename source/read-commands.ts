import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import decamelize from 'decamelize';
import picomatch from 'picomatch';
import type {CommandExports, Command} from './internal-types.js';

type ReadCommandsOptions = {
	ignore?: string[];
	rootDirectory?: string;
	isIgnoredPath?: (filePath: string) => boolean;
};

const readCommands = async (
	directory: string,
	options: ReadCommandsOptions = {},
): Promise<Map<string, Command>> => {
	const commands = new Map<string, Command>();
	const files = await fs.readdir(directory);
	const rootDirectory = options.rootDirectory ?? directory;
	const ignore = options.ignore ?? [];
	// remove trailing slash from glob patterns
	const normalizedIgnore = ignore.map(
		pattern => pattern.replace(/\/+$/g, '') || pattern,
	);
	const isIgnoredPath =
		options.isIgnoredPath ??
		picomatch(normalizedIgnore, {
			dot: true,
			posixSlashes: true,
		});

	for (const file of files) {
		if (file.startsWith('_app')) {
			continue;
		}

		const filePath = path.join(directory, file);
		const relativePath = path.relative(rootDirectory, filePath);

		if (isIgnoredPath(relativePath)) {
			continue;
		}

		const stat = await fs.stat(filePath);

		if (stat.isDirectory()) {
			const subCommands = await readCommands(filePath, {
				rootDirectory,
				isIgnoredPath,
			});
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

		if (!/\.(js|ts)x?$/.test(file) || file.endsWith('.d.ts')) {
			continue;
		}

		const fileUrl = pathToFileURL(filePath);
		const m = (await import(fileUrl.href)) as CommandExports;
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
