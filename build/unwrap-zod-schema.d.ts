import type { ZodOptional, ZodDefault, ZodString, ZodNumber, ZodBoolean, ZodTuple, ZodEnum, ZodSet, ZodArray } from 'zod';
declare const unwrapZodSchema: <T extends ZodString | ZodNumber | ZodEnum<[string]> | ZodBoolean | ZodArray<ZodString | ZodNumber | ZodEnum<[string]> | ZodBoolean, "many"> | ZodTuple<[import("zod").ZodTypeAny, ...import("zod").ZodTypeAny[]], null> | ZodSet<import("zod").ZodTypeAny>>(schema: T | ZodOptional<T> | ZodDefault<T>) => {
    defaultValue: unknown;
    schema: T;
};
export default unwrapZodSchema;
