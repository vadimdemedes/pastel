import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const options = z.object({
	tag: z.array(z.string()).optional().describe('Tags'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Tags = {options.tag?.join(', ')}</Text>;
}
