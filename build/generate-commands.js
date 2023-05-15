import { Command as CommanderCommand } from 'commander';
import generateCommand from './generate-command.js';
const generateCommands = (parentCommanderCommand, pastelCommands) => {
    if (pastelCommands.size > 0) {
        parentCommanderCommand.addHelpCommand('help [command]', 'Show help for command');
    }
    for (const [name, pastelCommand] of pastelCommands) {
        const commanderCommand = new CommanderCommand(name);
        generateCommand(commanderCommand, pastelCommand);
        if (pastelCommand.commands) {
            generateCommands(commanderCommand, pastelCommand.commands);
        }
        parentCommanderCommand.addCommand(commanderCommand, {
            isDefault: pastelCommand.isDefault,
        });
    }
};
export default generateCommands;
//# sourceMappingURL=generate-commands.js.map