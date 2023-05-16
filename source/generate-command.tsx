import {Command as CommanderCommand} from 'commander';
import {Command} from './types.js';
import {render} from 'ink';
import React from 'react';
import {StatusMessage} from '@inkjs/ui';
import {fromZodError} from 'zod-validation-error';
import flatten from 'just-flatten-it';
import generateOptions from './generate-options.js';
import generateArguments from './generate-arguments.js';

const generateCommand = (
	commanderCommand: CommanderCommand,
	pastelCommand: Command,
) => {
	commanderCommand.helpOption('-h, --help', 'Show help');

	if (pastelCommand.description) {
		commanderCommand.description(pastelCommand.description);
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
		const args = generateArguments(argumentsSchema);

		for (const argument of args) {
			if (argument.variadic) {
				hasVariadicArgument = true;
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

					process.exit(1);
				}
			}

			let args: unknown = [];

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
