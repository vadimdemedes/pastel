import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { Command } from 'commander';
import { readPackageUp } from 'read-pkg-up';
import generateCommand from './generate-command.js';
import readCommands from './read-commands.js';
import generateCommands from './generate-commands.js';
export default class Pastel {
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.options = options;
    }
    async run(argv = process.argv) {
        const commandsDirectory = fileURLToPath(new URL('commands', this.options.importMeta.url));
        const commands = await readCommands(commandsDirectory);
        const program = new Command();
        const indexCommand = commands.get('index');
        if (indexCommand) {
            generateCommand(program, indexCommand);
            commands.delete('index');
        }
        generateCommands(program, commands);
        if (this.options.name) {
            program.name(this.options.name);
        }
        const pkg = await readPackageUp();
        const version = this.options.version ?? pkg?.packageJson.version;
        if (version) {
            program.version(version, '-v, --version', 'Show version number');
        }
        const description = indexCommand?.description ??
            this.options.description ??
            pkg?.packageJson.description ??
            '';
        program.description(description);
        program.helpOption('-h, --help', 'Show help');
        program.parse(argv);
    }
}
//# sourceMappingURL=index.js.map