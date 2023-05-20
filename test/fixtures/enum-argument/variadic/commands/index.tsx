import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

const os = zod.enum(['macOS', 'Ubuntu', 'Debian', 'Windows']);

export const args = z
	.tuple([os.describe('first'), os.describe('second')])
	.rest(os.describe('rest'));

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
