import type { ZodOptional, ZodDefault } from 'zod';
import type { CommandOption } from './types.js';
declare const unwrapCommandOption: (option: CommandOption | ZodOptional<CommandOption> | ZodDefault<CommandOption>) => {
    defaultValue: unknown;
    option: CommandOption;
};
export default unwrapCommandOption;
