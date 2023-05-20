import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	tag: zod.array(zod.string()).describe(
		option({
			description: 'Tags',
		}),
	),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Tags = {options.tag.join(', ')}</Text>;
}
