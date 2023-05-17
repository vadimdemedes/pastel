import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {option} from '../../../../../source/index.js';

export const options = z.object({
	size: z
		.number()
		.default(128)
		.describe(
			option({
				description: 'Size',
				defaultValueDescription: '128 MB',
			}),
		),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Size = {options.size}</Text>;
}
