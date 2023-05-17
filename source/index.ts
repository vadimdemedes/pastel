import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {Command} from 'commander';
import {readPackageUp} from 'read-pkg-up';
import generateCommand from './generate-command.js';
import readCommands from './read-commands.js';
import generateCommands from './generate-commands.js';
import App from './app.js';
import readCustomApp from './read-custom-app.js';
import type {CommandArgumentConfig, CommandOptionConfig} from './types.js';

export type Options = {
	/**
	 * Program name. Defaults to the name of the executable.
	 */
	name?: string;

	/**
	 * Version. Defaults to version found in the nearest package.json.
	 */
	version?: string;

	/**
	 * Description. Defaults to description found in the nearest package.json.
	 */
	description?: string;

	/**
	 * Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta). This is used to find the `commands` directory.
	 */
	importMeta: ImportMeta;
};

export default class Pastel {
	constructor(private readonly options: Options) {}

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

		const pkg = await readPackageUp();

		const version = this.options.version ?? pkg?.packageJson.version;

		if (version) {
			program.version(version, '-v, --version', 'Show version number');
		}

		const description =
			indexCommand?.description ??
			this.options.description ??
			pkg?.packageJson.description ??
			'';

		program.description(description);
		program.helpOption('-h, --help', 'Show help');
		program.parse(argv);
	}
}

export function option(config: CommandOptionConfig) {
	return `__pastel_option_config__${JSON.stringify(config)}`;
}

export function argument(config: CommandArgumentConfig) {
	return `__pastel_argument_config__${JSON.stringify(config)}`;
}

export * from './types.js';
