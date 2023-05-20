import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

const os = zod.enum(['Ubuntu', 'Debian']);

export const args = zod.tuple([
	os.optional().describe(
		argument({
			name: 'first',
			description: 'First',
		}),
	),
	os.default('Debian').describe(
		argument({
			name: 'second',
			description: 'Second',
			defaultValueDescription: 'Debian',
		}),
	),
]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
