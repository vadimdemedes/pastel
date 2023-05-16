import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const args = z
	.tuple([z.number().describe('first'), z.number().describe('second')])
	.rest(z.number().describe('rest'));

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
