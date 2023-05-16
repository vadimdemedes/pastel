import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

const os = z.enum(['Ubuntu', 'Debian']).optional();

export const args = z.tuple([os.describe('first'), os.describe('second')]);

type Props = {
	args: z.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
