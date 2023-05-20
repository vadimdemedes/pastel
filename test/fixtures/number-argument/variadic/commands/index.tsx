import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = z
	.tuple([zod.number().describe('first'), zod.number().describe('second')])
	.rest(zod.number().describe('rest'));

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
