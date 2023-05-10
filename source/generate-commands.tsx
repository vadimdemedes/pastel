import React from 'react';
import {render} from 'ink';
import type {Argv} from 'yargs';
import type {Command} from './types.js';
import unwrapCommandOption from './unwrap-command-option.js';
import {StatusMessage} from '@inkjs/ui';
import {fromZodError} from 'zod-validation-error';

const getFullCommandName = (command: Command): string[] => {
	const fullCommandName = [command.name];

	if (command.parentCommand) {
		fullCommandName.unshift(...getFullCommandName(command.parentCommand));
	}

	return fullCommandName;
};

const stripCommandFromPositionalArguments = (
	positionalArguments: Array<string | number>,
	command: Command,
): Array<string | number> => {
	const fullCommandName = getFullCommandName(command);
	return positionalArguments.slice(fullCommandName.length);
};

const generateCommands = (y: Argv, commands: Map<string, Command>): Argv => {
	for (const [name, command] of commands) {
		y.command({
			command: name === 'index' ? '$0' : name,
			describe: command.description,
			builder(y) {
				if (command.options && command.options._def.typeName === 'ZodObject') {
					const options = command.options._def.shape();

					for (let [name, wrappedOption] of Object.entries(options)) {
						const isRequired = !wrappedOption.isOptional();
						const description = wrappedOption.description ?? '';
						const {defaultValue, option} = unwrapCommandOption(wrappedOption);

						if (option._def.typeName === 'ZodString') {
							y.option(name, {
								type: 'string',
								demandOption: isRequired,
								description,
								default: defaultValue,
							});
						}

						if (option._def.typeName === 'ZodNumber') {
							y.option(name, {
								type: 'number',
								demandOption: isRequired,
								description,
								default: defaultValue,
							});
						}

						if (option._def.typeName === 'ZodBoolean') {
							y.option(name, {
								type: 'boolean',
								description,
								default: defaultValue ?? false,
							});
						}

						if (option._def.typeName === 'ZodEnum') {
							y.option(name, {
								type: 'string',
								choices: option._def.values,
								demandOption: isRequired,
								description,
								default: defaultValue,
							});
						}

						if (option._def.typeName === 'ZodArray') {
							y.option(name, {
								type: 'array',
								demandOption: isRequired,
								description,
							});
						}

						if (option._def.typeName === 'ZodSet') {
							y.option(name, {
								type: 'array',
								demandOption: isRequired,
								description,
								coerce: value => new Set(value),
							});
						}
					}
				}

				if (
					command.positionalArguments &&
					command.positionalArguments._def.typeName === 'ZodTuple'
				) {
					const {items} = command.positionalArguments._def;
					let description = '';

					for (let item of items) {
						const isRequired = !item.isOptional();

						if (item._def.typeName === 'ZodOptional') {
							item = item._def.innerType;
						}

						const name = item.description ?? 'arg';
						description += isRequired ? `<${name}> ` : `[${name}] `;
					}

					y.usage(`\nUsage\n  $0 ${description}`);
				}

				if (command.commands) {
					generateCommands(y, command.commands);
				}

				return y;
			},
			async handler({$0: _program, _: input, ...options}) {
				if (command.component) {
					let parsedPositionalArguments: Array<string | number | undefined> =
						[];

					if (command.positionalArguments) {
						const result = command.positionalArguments.safeParse(
							stripCommandFromPositionalArguments(input, command),
						);

						if (result.success) {
							parsedPositionalArguments = result.data;
						} else {
							render(
								<StatusMessage variant="error">
									{
										fromZodError(result.error, {
											maxIssuesInMessage: 1,
											prefix: 'Positional arguments',
										}).message
									}
								</StatusMessage>,
							);

							process.exit(1);
						}
					}

					let parsedOptions = {};

					if (command.options) {
						const result = command.options.safeParse(options);

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

					const props = {
						options: parsedOptions,
						positionalArguments: parsedPositionalArguments,
					};

					render(React.createElement<any>(command.component, props));
					return;
				}

				console.log(await y.getHelp());
			},
		});
	}

	return y;
};

export default generateCommands;
