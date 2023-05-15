import { isDeepStrictEqual } from 'node:util';
import { Argument, Option } from 'commander';
import { render } from 'ink';
import React from 'react';
import unwrapZodSchema from './unwrap-zod-schema.js';
import { StatusMessage } from '@inkjs/ui';
import { fromZodError } from 'zod-validation-error';
const generateCommand = (commanderCommand, pastelCommand) => {
    commanderCommand.helpOption('-h, --help', 'Show help');
    if (pastelCommand.description) {
        commanderCommand.description(pastelCommand.description);
    }
    if (pastelCommand.options &&
        pastelCommand.options._def.typeName === 'ZodObject') {
        const options = pastelCommand.options._def.shape();
        for (let [name, wrappedOption] of Object.entries(options)) {
            const { defaultValue, schema: option } = unwrapZodSchema(wrappedOption);
            let flag = `--${name}`;
            const expectsValue = [
                'ZodString',
                'ZodNumber',
                'ZodEnum',
                'ZodArray',
                'ZodSet',
            ].includes(option._def.typeName);
            if (expectsValue) {
                const isVariadic = ['ZodArray', 'ZodSet'].includes(option._def.typeName);
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
            }
            else if (option._def.typeName === 'ZodBoolean') {
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
                    const joinPreviousValue = previousValue instanceof Set &&
                        !isDeepStrictEqual(previousValue, defaultValue);
                    return joinPreviousValue
                        ? new Set([...previousValue, value])
                        : new Set([value]);
                });
            }
            commanderCommand.addOption(commanderOption);
        }
    }
    if (pastelCommand.positionalArguments &&
        pastelCommand.positionalArguments._def.typeName === 'ZodTuple') {
        for (const wrappedPositionalArgument of pastelCommand.positionalArguments
            ._def.items) {
            const { schema: positionalArgument } = unwrapZodSchema(wrappedPositionalArgument);
            if (positionalArgument._def.typeName === 'ZodString') {
                const name = positionalArgument.description ?? 'arg';
                const argument = new Argument(wrappedPositionalArgument.isOptional() ? `[${name}]` : `<${name}>`);
                commanderCommand.addArgument(argument);
            }
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
                }
                else {
                    render(React.createElement(StatusMessage, { variant: "error" }, fromZodError(result.error, {
                        maxIssuesInMessage: 1,
                        prefix: '',
                        prefixSeparator: '',
                    }).message));
                    process.exit(1);
                }
            }
            let positionalArguments = [];
            if (pastelCommand.positionalArguments) {
                const result = pastelCommand.positionalArguments.safeParse(input);
                if (result.success) {
                    positionalArguments = result.data;
                }
                else {
                    render(React.createElement(StatusMessage, { variant: "error" }, fromZodError(result.error, {
                        maxIssuesInMessage: 1,
                        prefix: '',
                        prefixSeparator: '',
                    }).message));
                    process.exit(1);
                }
            }
            render(React.createElement(component, {
                options: parsedOptions,
                positionalArguments,
            }));
        });
    }
};
export default generateCommand;
//# sourceMappingURL=generate-command.js.map