import {fileURLToPath} from 'node:url';
import process from 'node:process';
import yargs from 'yargs';
import generateCommands from './generate-commands.js';
import readCommands from './read-commands.js';

export interface Options {
	/**
	 * Program name. Defaults to the name of the executable.
	 */
	name?: string;

	/**
	 * Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta). This is used to find the `commands` directory.
	 */
	importMeta: ImportMeta;
}

export default class Pastel {
	private options: Options;

	constructor(options: Options) {
		this.options = options;
	}

	async run(argv: string[] = process.argv.slice(2)) {
		const commandsDirectory = fileURLToPath(
			new URL('commands', this.options.importMeta.url),
		);

		const commands = await readCommands(commandsDirectory);
		const y = yargs(argv);
		await generateCommands(y, commands);

		if (this.options.name) {
			y.scriptName(this.options.name);
		}

		await y.help().parseAsync();
	}
}
