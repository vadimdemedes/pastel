import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

const os = zod.enum(['Ubuntu', 'Debian']);

export const args = zod.tuple([
	os.describe(
		argument({
			name: 'first',
			description: 'First',
		}),
	),
	os.describe(
		argument({
			name: 'second',
			description: 'Second',
		}),
	),
]);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
