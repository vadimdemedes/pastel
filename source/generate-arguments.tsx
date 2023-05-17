import {isDeepStrictEqual} from 'node:util';
import {Argument} from 'commander';
import {CommandArguments} from './types.js';
import {
	ZodArray,
	ZodDefault,
	ZodEnum,
	ZodNumber,
	ZodOptional,
	ZodTuple,
} from 'zod';
import decamelize from 'decamelize';

export default function generateArguments(
	argumentsSchema: CommandArguments,
): Argument[] {
	let isOptionalByDefault = false;
	let arrayDefaultValue: unknown;
	let arrayName = argumentsSchema.description;

	if (argumentsSchema instanceof ZodOptional) {
		isOptionalByDefault = true;
		argumentsSchema = argumentsSchema._def.innerType;
		arrayName = argumentsSchema.description ?? arrayName;
	}

	if (argumentsSchema instanceof ZodDefault) {
		isOptionalByDefault = true;
		arrayDefaultValue = argumentsSchema._def.defaultValue();
		argumentsSchema = argumentsSchema._def.innerType;
		arrayName = argumentsSchema.description ?? arrayName;
	}

	if (argumentsSchema instanceof ZodOptional) {
		isOptionalByDefault = true;
		argumentsSchema = argumentsSchema._def.innerType;
		arrayName = argumentsSchema.description ?? arrayName;
	}

	const args: Argument[] = [];

	if (argumentsSchema instanceof ZodTuple) {
		for (let argumentSchema of argumentsSchema._def.items) {
			let isOptional = isOptionalByDefault;
			let defaultValue: unknown;
			let name = argumentSchema.description;

			if (argumentSchema instanceof ZodOptional) {
				isOptional = true;
				argumentSchema = argumentSchema._def.innerType;
				name = argumentSchema.description ?? name;
			}

			if (argumentSchema instanceof ZodDefault) {
				isOptional = true;
				defaultValue = argumentSchema._def.defaultValue();
				argumentSchema = argumentSchema._def.innerType;
				name = argumentSchema.description ?? name;
			}

			if (argumentSchema instanceof ZodOptional) {
				isOptional = true;
				argumentSchema = argumentSchema._def.innerType;
				name = argumentSchema.description ?? name;
			}

			if (name) {
				name = decamelize(name, {separator: '-'});
			}

			const argument = new Argument(isOptional ? `[${name}]` : `<${name}>`);

			if (argumentSchema instanceof ZodNumber) {
				argument.argParser(value => Number.parseFloat(value));
			}

			if (argumentSchema instanceof ZodEnum) {
				argument.choices(argumentSchema._def.values);
			}

			if (defaultValue !== undefined) {
				argument.default(defaultValue);
			}

			args.push(argument);
		}

		const restSchema = argumentsSchema._def.rest;

		if (restSchema) {
			const name = restSchema.description ?? 'arg';
			const argument = new Argument(`[${name}...]`);

			if (restSchema instanceof ZodNumber) {
				argument.argParser<number[]>((value, previousValue) => {
					return [...(previousValue ?? []), Number.parseFloat(value)];
				});
			}

			if (restSchema instanceof ZodEnum) {
				argument.choices(restSchema._def.values);
			}

			args.push(argument);
		}
	}

	if (argumentsSchema instanceof ZodArray) {
		const name = arrayName ?? 'arg';

		const argument = new Argument(
			isOptionalByDefault ? `[${name}...]` : `<${name}...>`,
		);

		if (arrayDefaultValue !== undefined) {
			argument.default(arrayDefaultValue);
		}

		if (argumentsSchema.element instanceof ZodNumber) {
			argument.argParser<number[]>((value, previousValue) => {
				const joinPreviousValue = !isDeepStrictEqual(
					previousValue,
					arrayDefaultValue,
				);

				return joinPreviousValue
					? [...(previousValue ?? []), Number.parseFloat(value)]
					: [Number.parseFloat(value)];
			});
		}

		args.push(argument);
	}

	return args;
}
