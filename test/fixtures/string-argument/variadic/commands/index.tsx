import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.tuple([zod.string().describe('name'), zod.string().describe('surname')])
	.rest(zod.string().describe('traits'));

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
