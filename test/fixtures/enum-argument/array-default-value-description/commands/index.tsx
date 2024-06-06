import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod
	.array(zod.enum(['macOS', 'Ubuntu', 'Debian', 'Windows']))
	.default(['macOS', 'Windows'])
	.describe(
		argument({
			name: 'os',
			description: 'Operating systems',
			defaultValueDescription: 'macOS, Windows',
		}),
	);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
