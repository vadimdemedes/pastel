import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = z
	.array(zod.string())
	.default(['Jane', 'Hopper'])
	.describe(
		argument({
			name: 'traits',
			description: 'Traits',
			defaultValueDescription: 'Jane, Hopper',
		}),
	);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
