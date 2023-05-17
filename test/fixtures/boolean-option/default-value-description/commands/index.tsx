import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {option} from '../../../../../source/index.js';

export const options = z.object({
	force: z
		.boolean()
		.default(true)
		.describe(
			option({
				description: 'Force',
				defaultValueDescription: 'yes',
			}),
		),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Force = {String(options.force)}</Text>;
}
