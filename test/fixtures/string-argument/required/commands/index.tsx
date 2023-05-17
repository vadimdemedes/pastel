import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = z.tuple([
	z.string().describe('name'),
	z.string().describe(
		argument({
			name: 'surname',
		}),
	),
]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
