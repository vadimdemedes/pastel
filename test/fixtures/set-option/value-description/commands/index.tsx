import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {option} from '../../../../../source/index.js';

export const options = z.object({
	tag: z.set(z.string()).describe(
		option({
			description: 'Tags',
			valueDescription: 'some-tags',
		}),
	),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Tags = {[...options.tag].join(', ')}</Text>;
}
