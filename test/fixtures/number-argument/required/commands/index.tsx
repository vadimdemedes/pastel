import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = z.tuple([
	z.number().describe('first'),
	z.number().describe(
		argument({
			name: 'second',
		}),
	),
]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
