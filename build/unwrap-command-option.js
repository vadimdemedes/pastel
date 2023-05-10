const unwrapCommandOption = (option) => {
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
        option: option,
    };
};
export default unwrapCommandOption;
//# sourceMappingURL=unwrap-command-option.js.map