import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const args = z.array(z.number()).describe('number');

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
