import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const args = z.tuple([
	z.number().optional().describe('first'),
	z.number().default(256).describe('second'),
]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
