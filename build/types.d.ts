import type { ComponentType } from 'react';
import type { ZodObject, ZodOptional, ZodDefault, ZodTuple, ZodArray, ZodSet, ZodString, ZodNumber, ZodEnum, ZodBoolean } from 'zod';
export type Command = {
    name: string;
    description?: string;
    isDefault: boolean;
    options?: ZodObject<Record<string, CommandOption | ZodOptional<CommandOption> | ZodDefault<CommandOption>>>;
    positionalArguments?: ZodTuple<[
        CommandPositionalArgument | ZodOptional<CommandPositionalArgument>
    ]>;
    component?: ComponentType;
    commands?: Map<string, Command>;
    parentCommand?: Command;
};
export type CommandOption = NestedCommandOption | ZodArray<NestedCommandOption> | ZodSet<NestedCommandOption>;
export type NestedCommandOption = ZodString | ZodNumber | ZodEnum<[string]> | ZodBoolean;
export type CommandPositionalArgument = ZodString | ZodNumber | ZodEnum<[string]>;
