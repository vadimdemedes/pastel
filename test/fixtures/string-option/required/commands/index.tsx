import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	name: zod
		.string()
		.regex(/[a-z]+/i, {
			message: 'Invalid value',
		})
		.describe('Name'),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>Name = {options.name}</Text>;
}
