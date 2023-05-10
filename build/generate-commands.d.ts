import type { Argv } from 'yargs';
import type { Command } from './types.js';
declare const generateCommands: (y: Argv, commands: Map<string, Command>) => Argv;
export default generateCommands;
