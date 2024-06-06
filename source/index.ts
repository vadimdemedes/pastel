import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {Command} from 'commander';
import {readPackageUp} from 'read-package-up';
import generateCommand from './generate-command.js';
import readCommands from './read-commands.js';
import generateCommands from './generate-commands.js';
import App from './_app.js';
import readCustomApp from './read-custom-app.js';
import type {CommandArgumentConfig, CommandOptionConfig} from './types.js';

export type Options = {
	/**
	 * Program name. Defaults to `name` in the nearest package.json or the name of the executable.
	 */
	name?: string;

	/**
	 * Version. Defaults to `version` in the nearest package.json.
	 */
	version?: string;

	/**
	 * Description. Defaults to `description` in the nearest package.json.
	 */
	description?: string;

	/**
	 * Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta). This is used to find the `commands` directory.
	 */
	importMeta: ImportMeta;
};

export default class Pastel {
	constructor(private readonly options: Options) {}

	/**
	 * Run the app.
	 */
	async run(argv: string[] = process.argv) {
		const commandsDirectory = fileURLToPath(
			new URL('commands', this.options.importMeta.url),
		);

		const appComponent = (await readCustomApp(commandsDirectory)) ?? App;
		const program = new Command();

		const commands = await readCommands(commandsDirectory);
		const indexCommand = commands.get('index');

		if (indexCommand) {
			generateCommand(program, indexCommand, {appComponent});
			commands.delete('index');
		}

		generateCommands(program, commands, {appComponent});

		if (this.options.name) {
			program.name(this.options.name);
		}

		const package_ = await readPackageUp();

		const version = this.options.version ?? package_?.packageJson.version;

		if (version) {
			program.version(version, '-v, --version', 'Show version number');
		}

		const description =
			indexCommand?.description ??
			this.options.description ??
			package_?.packageJson.description ??
			'';

		program.description(description);
		program.helpOption('-h, --help', 'Show help');
		program.parse(argv);
	}
}

/**
 * Set additional metadata for an option. Must be used as an argument to `describe` function from Zod.
 */
export function option(config: CommandOptionConfig) {
	return `__pastel_option_config__${JSON.stringify(config)}`;
}

/**
 * Set additional metadata for an argument. Must be used as an argument to `describe` function from Zod.
 */
export function argument(config: CommandArgumentConfig) {
	return `__pastel_argument_config__${JSON.stringify(config)}`;
}

export * from './types.js';
