import {isDeepStrictEqual} from 'node:util';
import {Option} from 'commander';
import decamelize from 'decamelize';
import {
	ZodArray,
	ZodBoolean,
	ZodDefault,
	ZodEnum,
	ZodNumber,
	ZodOptional,
	ZodSet,
} from 'zod';
import plur from 'plur';
import {type CommandOptions} from './internal-types.js';
import {type CommandOptionConfig} from './types.js';

const getConfig = (
	value: string | undefined,
): CommandOptionConfig | undefined => {
	return value?.startsWith('__pastel_option_config__')
		? (JSON.parse(
				value.replace('__pastel_option_config__', ''),
			) as CommandOptionConfig)
		: undefined;
};

const getDescription = (value: string | undefined): string | undefined => {
	return getConfig(value)?.description ?? value;
};

const getDefaultValueDescription = (
	value: string | undefined,
): string | undefined => {
	return getConfig(value)?.defaultValueDescription;
};

const getValueDescription = (value: string | undefined): string | undefined => {
	return getConfig(value)?.valueDescription;
};

const getAlias = (value: string | undefined): string | undefined => {
	return getConfig(value)?.alias;
};

export default function generateOptions(
	optionsSchema: CommandOptions,
): Option[] {
	let isOptionalByDefault = false;

	if (optionsSchema instanceof ZodOptional) {
		isOptionalByDefault = true;
		optionsSchema = optionsSchema._zod.def.innerType;
	}

	const options: Option[] = [];

	for (let [name, optionSchema] of Object.entries(
		optionsSchema._zod.def.shape,
	)) {
		name = decamelize(name, {separator: '-'});

		let defaultValue: unknown;
		let isOptional = isOptionalByDefault;

		// Collect description before unwrapping (for .default().describe() pattern)
		let schemaDescription = optionSchema.description;

		// Unwrap zod.string().optional()
		if (optionSchema instanceof ZodOptional) {
			isOptional = true;
			optionSchema = optionSchema._zod.def.innerType;
		}

		// Unwrap zod.string().optional().default()
		if (optionSchema instanceof ZodDefault) {
			isOptional = true;
			defaultValue = optionSchema._zod.def.defaultValue;
			optionSchema = optionSchema._zod.def.innerType;
		}

		// Unwrap zod.string().default().optional()
		if (optionSchema instanceof ZodOptional) {
			isOptional = true;
			optionSchema = optionSchema._zod.def.innerType;
		}

		// Use description from inner schema if not found on outer (for .describe().default() pattern)
		schemaDescription ||= optionSchema.description;

		let defaultValueDescription = getDefaultValueDescription(schemaDescription);

		const description = getDescription(schemaDescription);
		let valueDescription = getValueDescription(schemaDescription);

		const alias = getAlias(schemaDescription);
		let flag = `--${name}`;

		if (optionSchema instanceof ZodBoolean && defaultValue === true) {
			flag = `--no-${name}`;
		} else if (alias) {
			flag = `-${alias}, --${name}`;
		}

		const expectsValue = !(optionSchema instanceof ZodBoolean);

		if (expectsValue) {
			const isVariadic =
				optionSchema instanceof ZodArray || optionSchema instanceof ZodSet;

			valueDescription ||= isVariadic ? plur(name) : name;

			const rest = isVariadic ? '...' : '';

			flag +=
				isOptional || defaultValue
					? ` [${valueDescription}${rest}]`
					: ` <${valueDescription}${rest}>`;
		}

		const option = new Option(flag, description);

		if (optionSchema instanceof ZodNumber) {
			option.argParser(value => Number.parseFloat(value));
		}

		if (optionSchema instanceof ZodEnum) {
			option.choices(Object.values(optionSchema._zod.def.entries).map(String));
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
			if (!defaultValueDescription && defaultValue instanceof Set) {
				defaultValueDescription = JSON.stringify([...defaultValue]);
			}

			option.default(defaultValue, defaultValueDescription);
		}

		options.push(option);
	}

	return options;
}
