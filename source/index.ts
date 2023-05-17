import {fileURLToPath} from 'node:url';
import process from 'node:process';
import {Command} from 'commander';
import {readPackageUp} from 'read-pkg-up';
import generateCommand from './generate-command.js';
import readCommands from './read-commands.js';
import generateCommands from './generate-commands.js';
import App from './App.js';
import readCustomApp from './read-custom-app.js';

export interface Options {
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
}

export default class Pastel {
	private options: Options;

	constructor(options: Options) {
		this.options = options;
	}

	async run(argv: string[] = process.argv) {
		const commandsDirectory = fileURLToPath(
			new URL('commands', this.options.importMeta.url),
		);

		const AppComponent = (await readCustomApp(commandsDirectory)) ?? App;
		const program = new Command();

		const commands = await readCommands(commandsDirectory);
		const indexCommand = commands.get('index');

		if (indexCommand) {
			generateCommand(program, indexCommand, {AppComponent});
			commands.delete('index');
		}

		generateCommands(program, commands, {AppComponent});

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

export * from './types.js';
