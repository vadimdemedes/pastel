import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	size: zod.number().describe(
		option({
			description: 'Size',
		}),
	),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>Size = {options.size}</Text>;
}
