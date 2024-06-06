import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.tuple([zod.number().describe('first'), zod.number().describe('second')])
	.rest(zod.number().describe('rest'));

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
