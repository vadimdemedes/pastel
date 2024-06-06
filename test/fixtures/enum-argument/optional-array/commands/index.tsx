import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.array(zod.enum(['Ubuntu', 'Debian']))
	.optional()
	.describe('os');

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args?.join(', ') ?? ''}</Text>;
}
