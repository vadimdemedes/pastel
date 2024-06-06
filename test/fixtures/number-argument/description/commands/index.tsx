import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod.tuple([
	zod.number().describe(
		argument({
			name: 'first',
			description: 'First',
		}),
	),
	zod.number().describe(
		argument({
			name: 'second',
			description: 'Second',
		}),
	),
]);

type Props = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
