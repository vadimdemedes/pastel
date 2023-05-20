import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.tuple([
	zod.string().optional().describe('name'),
	zod.string().optional().describe('surname'),
]);

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
