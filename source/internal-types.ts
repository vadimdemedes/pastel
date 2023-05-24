import type {ComponentType} from 'react';
import type {
	ZodObject,
	ZodOptional,
	ZodDefault,
	ZodTuple,
	ZodArray,
	ZodSet,
	ZodString,
	ZodNumber,
	ZodEnum,
	ZodBoolean,
	ZodTypeAny,
} from 'zod';
import {type AppProps} from './types.js';

export type Command = {
	name: string;
	description?: string;
	isDefault: boolean;
	alias?: string;
	options?: CommandOptions;
	args?: CommandArguments;
	component?: ComponentType<AppProps['commandProps']>;
	commands?: Map<string, Command>;
	parentCommand?: Command;
};

export type CommandExports = {
	description?: string;
	isDefault?: boolean;
	alias?: string;
	options?: CommandOptions;
	args?: CommandArguments;
	default?: ComponentType<AppProps['commandProps']>;
};

export type CommandOptions = ZodMaybeOptional<
	ZodObject<Record<string, CommandOption>>
>;

export type ZodMaybeOptional<T extends ZodTypeAny> = T | ZodOptional<T>;

export type ZodMaybeOptionalOrDefault<T extends ZodTypeAny> =
	| T
	| ZodOptional<T>
	| ZodDefault<T>
	| ZodOptional<ZodDefault<T>>
	| ZodDefault<ZodOptional<T>>;

export type CommandOption =
	| ZodMaybeOptionalOrDefault<ZodString>
	| ZodMaybeOptionalOrDefault<ZodNumber>
	| ZodMaybeOptionalOrDefault<ZodEnum<[string, ...string[]]>>
	| ZodMaybeOptionalOrDefault<ZodBoolean>
	| ZodMaybeOptionalOrDefault<ZodArray<ZodString>>
	| ZodMaybeOptionalOrDefault<ZodArray<ZodNumber>>
	| ZodMaybeOptionalOrDefault<ZodArray<ZodEnum<[string, ...string[]]>>>
	| ZodMaybeOptionalOrDefault<ZodSet<ZodString>>
	| ZodMaybeOptionalOrDefault<ZodSet<ZodNumber>>
	| ZodMaybeOptionalOrDefault<ZodSet<ZodEnum<[string, ...string[]]>>>;

export type CommandArguments = ZodMaybeOptionalOrDefault<
	CommandArgumentsTuple | CommandArgumentsArray
>;

export type CommandArgumentsTuple = ZodTuple<
	[
		ZodMaybeOptionalOrDefault<CommandArgument>,
		...Array<ZodMaybeOptionalOrDefault<CommandArgument>>,
	],
	// eslint-disable-next-line @typescript-eslint/ban-types
	CommandArgument | null
>;

export type CommandArgumentsArray =
	| ZodArray<ZodString>
	| ZodArray<ZodNumber>
	| ZodArray<ZodEnum<[string, ...string[]]>>;

export type CommandArgument =
	| ZodString
	| ZodNumber
	| ZodEnum<[string, ...string[]]>;
