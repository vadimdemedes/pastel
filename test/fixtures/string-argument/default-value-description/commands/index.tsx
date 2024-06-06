import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from '../../../../../source/index.js';

export const args = zod.tuple([
	zod
		.string()
		.optional()
		.describe(
			argument({
				name: 'name',
				description: 'Name',
			}),
		),
	zod
		.string()
		.default('Hopper')
		.describe(
			argument({
				name: 'surname',
				description: 'Surname',
				defaultValueDescription: 'Hopper',
			}),
		),
]);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
