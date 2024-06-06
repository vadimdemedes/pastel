import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

const os = zod.enum(['Ubuntu', 'Debian']);

export const args = zod.tuple([
	os.optional().describe('first'),
	os.default('Debian').describe('second'),
]);

type Props = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
