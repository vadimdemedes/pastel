import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = z.tuple([
	z
		.string()
		.optional()
		.describe(
			argument({
				name: 'name',
				description: 'Name',
			}),
		),
	z
		.string()
		.default('Hopper')
		.describe(
			argument({
				name: 'surname',
				description: 'Surname',
				defaultValueDescription: 'Hopper',
			}),
		),
]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
