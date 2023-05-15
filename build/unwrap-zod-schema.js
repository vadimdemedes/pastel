const unwrapZodSchema = (schema) => {
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
        schema: schema,
    };
};
export default unwrapZodSchema;
//# sourceMappingURL=unwrap-zod-schema.js.map