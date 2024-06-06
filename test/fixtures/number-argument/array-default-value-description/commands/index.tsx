import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod
	.array(zod.number())
	.default([128, 256])
	.describe(
		argument({
			name: 'number',
			description: 'Numbers',
			defaultValueDescription: '128, 256',
		}),
	);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
