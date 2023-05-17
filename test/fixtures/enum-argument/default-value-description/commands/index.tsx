import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';
import {argument} from '../../../../../source/index.js';

const os = z.enum(['Ubuntu', 'Debian']);

export const args = z.tuple([
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
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
