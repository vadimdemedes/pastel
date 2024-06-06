import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod
	.object({
		name: zod.string().describe('Name'),
	})
	.partial();

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>Name = {options.name ?? 'empty'}</Text>;
}
