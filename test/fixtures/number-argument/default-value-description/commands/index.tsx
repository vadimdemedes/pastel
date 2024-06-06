import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod.tuple([
	zod
		.number()
		.optional()
		.describe(
			argument({
				name: 'first',
				description: 'First',
			}),
		),
	zod
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

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
