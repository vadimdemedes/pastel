import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.array(zod.enum(['macOS', 'Ubuntu', 'Debian', 'Windows']))
	.default(['macOS', 'Windows'])
	.describe('os');

type Props = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
