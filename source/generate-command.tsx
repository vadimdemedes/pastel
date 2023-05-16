import {isDeepStrictEqual} from 'node:util';
import {Argument, Command as CommanderCommand, Option} from 'commander';
import {Command} from './types.js';
import {render} from 'ink';
import React from 'react';
import unwrapZodSchema from './unwrap-zod-schema.js';
import {StatusMessage} from '@inkjs/ui';
import {fromZodError} from 'zod-validation-error';
import {ZodEnum, ZodFirstPartyTypeKind, ZodNumber, ZodString} from 'zod';
import flatten from 'just-flatten-it';
import {
	getDefaultValue,
	isArrayArguments,
	isTupleArguments,
	unwrap,
} from './zod-utils.js';

const generateCommand = (
	commanderCommand: CommanderCommand,
	pastelCommand: Command,
) => {
	commanderCommand.helpOption('-h, --help', 'Show help');

	if (pastelCommand.description) {
		commanderCommand.description(pastelCommand.description);
	}

	if (
		pastelCommand.options &&
		pastelCommand.options._def.typeName === 'ZodObject'
	) {
		const options = pastelCommand.options._def.shape();

		for (let [name, wrappedOption] of Object.entries(options)) {
			const {defaultValue, schema: option} = unwrapZodSchema(wrappedOption);
			let flag = `--${name}`;

			const expectsValue = [
				'ZodString',
				'ZodNumber',
				'ZodEnum',
				'ZodArray',
				'ZodSet',
			].includes(option._def.typeName);

			if (expectsValue) {
				const isVariadic = ['ZodArray', 'ZodSet'].includes(
					option._def.typeName,
				);

				const rest = isVariadic ? '...' : '';

				flag +=
					wrappedOption.isOptional() || defaultValue
						? ` [value${rest}]`
						: ` <value${rest}>`;
			}

			const commanderOption = new Option(flag, wrappedOption.description);

			if (defaultValue) {
				commanderOption.default(defaultValue);

				if (defaultValue instanceof Set) {
					commanderOption.defaultValueDescription = JSON.stringify([
						...defaultValue,
					]);
				}
			} else if (option._def.typeName === 'ZodBoolean') {
				commanderOption.default(false);
			}

			if (option._def.typeName === 'ZodNumber') {
				commanderOption.argParser(Number.parseFloat);
			}

			if (option._def.typeName === 'ZodEnum') {
				commanderOption.choices(option._def.values);
			}

			if (option._def.typeName === 'ZodSet') {
				commanderOption.argParser((value, previousValue) => {
					const joinPreviousValue =
						previousValue instanceof Set &&
						!isDeepStrictEqual(previousValue, defaultValue);

					return joinPreviousValue
						? new Set([...previousValue, value])
						: new Set([value]);
				});
			}

			commanderCommand.addOption(commanderOption);
		}
	}

	let hasVariadicArgument = false;

	if (pastelCommand.args) {
		const argSchema = unwrap(pastelCommand.args);

		if (isTupleArguments(argSchema)) {
			for (const wrappedArgument of argSchema._def.items) {
				const {schema: positionalArgument} = unwrapZodSchema(wrappedArgument);

				if (positionalArgument._def.typeName === 'ZodString') {
					const name = wrappedArgument.description ?? 'arg';

					const argument = new Argument(
						wrappedArgument.isOptional() ? `[${name}]` : `<${name}>`,
					);

					commanderCommand.addArgument(argument);
				}

				if (positionalArgument._def.typeName === 'ZodNumber') {
					const name = wrappedArgument.description ?? 'arg';

					const argument = new Argument(
						wrappedArgument.isOptional() ? `[${name}]` : `<${name}>`,
					);

					argument.argParser(value => Number.parseFloat(value));

					commanderCommand.addArgument(argument);
				}
			}

			const rest = argSchema._def.rest as unknown as
				| ZodString
				| ZodNumber
				| ZodEnum<[string]>;

			if (rest) {
				hasVariadicArgument = true;
			}

			if (rest?._def.typeName === 'ZodString') {
				const name = rest.description ?? 'arg';
				const argument = new Argument(`[${name}...]`);

				commanderCommand.addArgument(argument);
			}

			if (rest?._def.typeName === 'ZodNumber') {
				const name = rest.description ?? 'arg';
				const argument = new Argument(`[${name}...]`);

				argument.argParser<number[]>((value, previousValue) => {
					return [...(previousValue ?? []), Number.parseFloat(value)];
				});

				commanderCommand.addArgument(argument);
			}
		}

		if (isArrayArguments(argSchema)) {
			hasVariadicArgument = true;

			const name = pastelCommand.args.description ?? 'arg';

			const argument = new Argument(
				pastelCommand.args.isOptional() ? `[${name}...]` : `<${name}...>`,
			);

			const defaultValue = getDefaultValue(pastelCommand.args);

			if (defaultValue) {
				argument.default(defaultValue);
			}

			if (argSchema.element._def.typeName === ZodFirstPartyTypeKind.ZodNumber) {
				argument.argParser<number[]>((value, previousValue) => {
					const joinPreviousValue = !isDeepStrictEqual(
						previousValue,
						defaultValue,
					);

					return joinPreviousValue
						? [...(previousValue ?? []), Number.parseFloat(value)]
						: [Number.parseFloat(value)];
				});
			}

			commanderCommand.addArgument(argument);
		}
	}

	const component = pastelCommand.component;

	if (component) {
		commanderCommand.action((...input) => {
			// Remove the last argument, which is an instance of Commander command
			input.pop();

			const options = input.pop();
			let parsedOptions = {};

			if (pastelCommand.options) {
				const result = pastelCommand.options.safeParse(options);

				if (result.success) {
					parsedOptions = result.data;
				} else {
					render(
						<StatusMessage variant="error">
							{
								fromZodError(result.error, {
									maxIssuesInMessage: 1,
									prefix: '',
									prefixSeparator: '',
								}).message
							}
						</StatusMessage>,
					);

					process.exit(1);
				}
			}

			let args: Array<string | number | undefined> = [];

			if (pastelCommand.args) {
				const result = pastelCommand.args.safeParse(
					hasVariadicArgument ? flatten(input) : input,
				);

				if (result.success) {
					args = result.data;
				} else {
					render(
						<StatusMessage variant="error">
							{
								fromZodError(result.error, {
									maxIssuesInMessage: 1,
									prefix: '',
									prefixSeparator: '',
								}).message
							}
						</StatusMessage>,
					);

					process.exit(1);
				}
			}

			render(
				React.createElement<any>(component, {
					options: parsedOptions,
					args,
				}),
			);
		});
	}
};

export default generateCommand;
