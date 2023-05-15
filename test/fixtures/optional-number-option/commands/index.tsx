import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const options = z.object({
	size: z.number().optional().describe('Size'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Size = {options.size ?? -1}</Text>;
}
