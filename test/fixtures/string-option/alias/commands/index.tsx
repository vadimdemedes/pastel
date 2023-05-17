import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {option} from '../../../../../source/index.js';

export const options = z.object({
	name: z
		.string()
		.regex(/[a-z]+/i, {
			message: 'Invalid value',
		})
		.describe(
			option({
				description: 'Name',
				alias: 'n',
			}),
		),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.name}</Text>;
}
