import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

const os = z.enum(['macOS', 'Ubuntu', 'Debian', 'Windows']);

export const args = z
	.tuple([os.describe('first'), os.describe('second')])
	.rest(os.describe('rest'));

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
