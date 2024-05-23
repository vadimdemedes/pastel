import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.array(zod.number())
	.default([128, 256])
	.describe('number');

type Props = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
