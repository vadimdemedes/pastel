import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod.tuple([
	z
		.number()
		.optional()
		.describe(
			argument({
				name: 'first',
				description: 'First',
			}),
		),
	z
		.number()
		.default(256)
		.describe(
			argument({
				name: 'second',
				description: 'Second',
				defaultValueDescription: '256 MB',
			}),
		),
]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
