import type {
	ZodOptional,
	ZodDefault,
	ZodString,
	ZodNumber,
	ZodBoolean,
	ZodTuple,
	ZodEnum,
	ZodSet,
	ZodArray,
} from 'zod';

const unwrapZodSchema = <
	T extends
		| ZodString
		| ZodNumber
		| ZodBoolean
		| ZodArray<ZodString | ZodNumber | ZodBoolean | ZodEnum<[string]>>
		| ZodTuple
		| ZodEnum<[string]>
		| ZodSet,
>(
	schema: T | ZodOptional<T> | ZodDefault<T>,
): {
	defaultValue: unknown;
	schema: T;
} => {
	let defaultValue;

	// Handle z.string().default()
	if (schema._def.typeName === 'ZodDefault') {
		defaultValue = schema._def.defaultValue();
		schema = schema._def.innerType;
	}

	// Handle z.optional(z.string())
	if (schema._def.typeName === 'ZodOptional') {
		schema = schema._def.innerType;
	}

	// Handle z.optional(z.string().default())
	if (schema._def.typeName === 'ZodDefault') {
		defaultValue = schema._def.defaultValue();
		schema = schema._def.innerType;
	}

	return {
		defaultValue,
		schema: schema as T,
	};
};

export default unwrapZodSchema;
