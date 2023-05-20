import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod.tuple([
	zod.string().describe(
		argument({
			name: 'name',
			description: 'Name',
		}),
	),
	zod.string().describe(
		argument({
			name: 'surname',
			description: 'Surname',
		}),
	),
]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
