import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	name: zod
		.string()
		.regex(/[a-z]+/i, {
			message: 'Invalid value',
		})
		.describe(
			option({
				description: 'Name',
			}),
		),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.name}</Text>;
}
