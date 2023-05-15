import { Command as CommanderCommand } from 'commander';
import type { Command } from './types.js';
declare const generateCommands: (parentCommanderCommand: CommanderCommand, pastelCommands: Map<string, Command>) => void;
export default generateCommands;
