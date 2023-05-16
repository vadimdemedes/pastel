import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const args = z.tuple([
	z.string().optional().describe('name'),
	z.string().default('Hopper').describe('surname'),
]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
