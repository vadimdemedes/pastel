import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	tag: zod.array(zod.string()).describe(
		option({
			description: 'Tags',
			alias: 't',
		}),
	),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>Tags = {options.tag.join(', ')}</Text>;
}
