import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const description = 'Index command';

export const options = z
	.object({
		name: z.string().describe('Name'),
	})
	.partial();

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.name ?? 'empty'}</Text>;
}
