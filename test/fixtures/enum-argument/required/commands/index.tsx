import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

const os = zod.enum(['Ubuntu', 'Debian']);

export const args = zod.tuple([
	os.describe('first'),
	os.describe(
		argument({
			name: 'second',
		}),
	),
]);

type Props = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
