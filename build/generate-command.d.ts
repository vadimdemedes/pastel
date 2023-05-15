import { Command as CommanderCommand } from 'commander';
import type { Command } from './types.js';
declare const generateCommand: (commanderCommand: CommanderCommand, pastelCommand: Command) => void;
export default generateCommand;
