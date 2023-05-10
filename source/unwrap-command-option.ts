import type {ZodOptional, ZodDefault} from 'zod';
import type {CommandOption} from './types.js';

const unwrapCommandOption = (
	option:
		| CommandOption
		| ZodOptional<CommandOption>
		| ZodDefault<CommandOption>,
): {
	defaultValue: unknown;
	option: CommandOption;
} => {
	let defaultValue;

	// Handle z.string().default()
	if (option._def.typeName === 'ZodDefault') {
		defaultValue = option._def.defaultValue();
		option = option._def.innerType;
	}

	// Handle z.optional(z.string())
	if (option._def.typeName === 'ZodOptional') {
		option = option._def.innerType;
	}

	// Handle z.optional(z.string().default())
	if (option._def.typeName === 'ZodDefault') {
		defaultValue = option._def.defaultValue();
		option = option._def.innerType;
	}

	return {
		defaultValue,
		option: option as CommandOption,
	};
};

export default unwrapCommandOption;
