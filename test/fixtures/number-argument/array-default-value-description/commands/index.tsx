import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = z
	.array(z.number())
	.default([128, 256])
	.describe(
		argument({
			name: 'number',
			description: 'Numbers',
			defaultValueDescription: '128, 256',
		}),
	);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
