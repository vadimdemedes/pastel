import { fileURLToPath } from 'node:url';
import process from 'node:process';
import yargs from 'yargs';
import generateCommands from './generate-commands.js';
import readCommands from './read-commands.js';
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
    async run(argv = process.argv.slice(2)) {
        const commandsDirectory = fileURLToPath(new URL('commands', this.options.importMeta.url));
        const commands = await readCommands(commandsDirectory);
        const y = yargs(argv);
        await generateCommands(y, commands);
        if (this.options.name) {
            y.scriptName(this.options.name);
        }
        await y.help().parseAsync();
    }
}
//# sourceMappingURL=index.js.map