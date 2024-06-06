import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	tag: zod
		.set(zod.string())
		.default(new Set(['A', 'B']))
		.describe('Tags'),
});

type Props = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Tags = {[...options.tag].join(', ')}</Text>;
}
