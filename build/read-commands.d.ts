import { Command } from './types.js';
declare const readCommands: (directory: string) => Promise<Map<string, Command>>;
export default readCommands;
