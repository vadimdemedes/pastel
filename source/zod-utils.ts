import {ZodDefault, ZodFirstPartyTypeKind, ZodOptional, ZodTypeAny} from 'zod';
import {
	CommandArguments,
	CommandArgumentsArray,
	CommandArgumentsTuple,
} from './types.js';

export function isTupleArguments(
	schema: CommandArguments,
): schema is CommandArgumentsTuple {
	return schema._def.typeName === ZodFirstPartyTypeKind.ZodTuple;
}

export function isArrayArguments(
	schema: CommandArguments,
): schema is CommandArgumentsArray {
	return schema._def.typeName === ZodFirstPartyTypeKind.ZodArray;
}

export function unwrap<T extends ZodTypeAny>(
	schema: T | ZodOptional<T> | ZodDefault<T>,
): T {
	if (schema._def.typeName === 'ZodOptional') {
		return unwrap(schema._def.innerType);
	}

	if (schema._def.typeName === 'ZodDefault') {
		return unwrap(schema._def.innerType);
	}

	return schema as T;
}

export function getDefaultValue<T extends ZodTypeAny>(
	schema: T | ZodOptional<T> | ZodDefault<T>,
): unknown | undefined {
	if (schema._def.typeName === 'ZodOptional') {
		return getDefaultValue(schema._def.innerType);
	}

	if (schema._def.typeName === 'ZodDefault') {
		return schema._def.defaultValue();
	}

	return undefined;
}

export function getDescription<T extends ZodTypeAny>(
	schema: T,
): string | undefined {
	if (schema._def.typeName === 'ZodOptional') {
		return schema.description ?? getDescription(schema._def.innerType);
	}

	if (schema._def.typeName === 'ZodDefault') {
		return schema.description ?? getDescription(schema._def.innerType);
	}

	return schema.description;
}
