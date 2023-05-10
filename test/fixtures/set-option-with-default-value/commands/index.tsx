import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const description = 'Index command';

export const options = z.object({
	tag: z
		.set(z.string())
		.default(new Set(['A', 'B']))
		.describe('Tags'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Tags = {[...options.tag].join(', ')}</Text>;
}
