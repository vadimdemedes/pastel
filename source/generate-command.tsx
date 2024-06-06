import process from 'node:process';
import {type Command as CommanderCommand} from 'commander';
import {render} from 'ink';
import React, {type ComponentType} from 'react';
import {StatusMessage} from '@inkjs/ui';
import {fromZodError} from 'zod-validation-error';
import {type Command} from './internal-types.js';
import generateOptions from './generate-options.js';
import generateArguments from './generate-arguments.js';
import {type AppProps} from './types.js';

const generateCommand = (
	commanderCommand: CommanderCommand,
	pastelCommand: Command,
	{appComponent}: {appComponent: ComponentType<AppProps>},
) => {
	commanderCommand.helpOption('-h, --help', 'Show help');

	if (pastelCommand.description) {
		commanderCommand.description(pastelCommand.description);
	}

	if (pastelCommand.alias) {
		commanderCommand.alias(pastelCommand.alias);
	}

	const optionsSchema = pastelCommand.options;

	if (optionsSchema) {
		const options = generateOptions(optionsSchema);

		for (const option of options) {
			commanderCommand.addOption(option);
		}
	}

	let hasVariadicArgument = false;

	const argumentsSchema = pastelCommand.args;

	if (argumentsSchema) {
		const arguments_ = generateArguments(argumentsSchema);

		for (const argument of arguments_) {
			if (argument.variadic) {
				hasVariadicArgument = true;
			}

			commanderCommand.addArgument(argument);
		}
	}

	const {component} = pastelCommand;

	if (component) {
		commanderCommand.action((...input) => {
			// Remove the last argument, which is an instance of Commander command
			input.pop();

			const options = input.pop() as Record<string, unknown>;
			let parsedOptions: Record<string, unknown> = {};

			if (pastelCommand.options) {
				const result = pastelCommand.options.safeParse(options);

				if (result.success) {
					parsedOptions = result.data ?? {};
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

					// eslint-disable-next-line unicorn/no-process-exit
					process.exit(1);
				}
			}

			let arguments_: unknown[] = [];

			if (pastelCommand.args) {
				const result = pastelCommand.args.safeParse(
					hasVariadicArgument ? input.flat() : input,
				);

				if (result.success) {
					arguments_ = result.data ?? [];
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

					// eslint-disable-next-line unicorn/no-process-exit
					process.exit(1);
				}
			}

			render(
				React.createElement(appComponent, {
					Component: component,
					commandProps: {
						options: parsedOptions,
						args: arguments_,
					},
				}),
			);
		});
	}
};

export default generateCommand;
