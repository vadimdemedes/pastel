import {isDeepStrictEqual} from 'node:util';
import {Option} from 'commander';
import decamelize from 'decamelize';
import {CommandOptions} from './internal-types.js';
import {
	ZodArray,
	ZodBoolean,
	ZodDefault,
	ZodEnum,
	ZodNumber,
	ZodOptional,
	ZodSet,
} from 'zod';

export default function generateOptions(
	optionsSchema: CommandOptions,
): Option[] {
	let isOptionalByDefault = false;

	if (optionsSchema instanceof ZodOptional) {
		isOptionalByDefault = true;
		optionsSchema = optionsSchema._def.innerType;
	}

	const options: Option[] = [];

	for (let [name, optionSchema] of Object.entries(optionsSchema._def.shape())) {
		let defaultValue: unknown;
		let description = optionSchema.description;
		let isOptional = isOptionalByDefault;

		let flag = `--${decamelize(name, {separator: '-'})}`;

		// z.string().optional()
		if (optionSchema instanceof ZodOptional) {
			isOptional = true;
			optionSchema = optionSchema._def.innerType;
		}

		// z.string().optional().default()
		if (optionSchema instanceof ZodDefault) {
			isOptional = true;
			defaultValue = optionSchema._def.defaultValue();
			optionSchema = optionSchema._def.innerType;
		}

		// z.string().default().optional()
		if (optionSchema instanceof ZodOptional) {
			isOptional = true;
			optionSchema = optionSchema._def.innerType;
		}

		const expectsValue = !(optionSchema instanceof ZodBoolean);

		if (expectsValue) {
			const isVariadic =
				optionSchema instanceof ZodArray || optionSchema instanceof ZodSet;
			const rest = isVariadic ? '...' : '';

			flag +=
				isOptional || defaultValue ? ` [value${rest}]` : ` <value${rest}>`;
		}

		const option = new Option(flag, description);

		if (optionSchema instanceof ZodNumber) {
			option.argParser(value => Number.parseFloat(value));
		}

		if (optionSchema instanceof ZodEnum) {
			option.choices(optionSchema._def.values);
		}

		if (optionSchema instanceof ZodBoolean && defaultValue === undefined) {
			defaultValue = false;
		}

		if (optionSchema instanceof ZodSet) {
			option.argParser((value, previousValue) => {
				const joinPreviousValue =
					previousValue instanceof Set &&
					!isDeepStrictEqual(previousValue, defaultValue);

				return joinPreviousValue
					? new Set([...previousValue, value])
					: new Set([value]);
			});
		}

		if (defaultValue !== undefined) {
			option.default(defaultValue);

			if (defaultValue instanceof Set) {
				option.defaultValueDescription = JSON.stringify([...defaultValue]);
			}
		}

		options.push(option);
	}

	return options;
}
