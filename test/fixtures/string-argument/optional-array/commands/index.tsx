import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const args = z.array(z.string()).optional().describe('traits');

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args?.join(', ') ?? ''}</Text>;
}
