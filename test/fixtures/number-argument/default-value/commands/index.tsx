import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.tuple([
	zod.number().optional().describe('first'),
	zod.number().default(256).describe('second'),
]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
