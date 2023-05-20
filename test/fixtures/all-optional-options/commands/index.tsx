import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = z
	.object({
		name: zod.string().describe('Name'),
	})
	.partial();

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.name ?? 'empty'}</Text>;
}
