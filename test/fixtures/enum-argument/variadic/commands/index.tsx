import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

const os = zod.enum(['macOS', 'Ubuntu', 'Debian', 'Windows']);

export const args = zod
	.tuple([os.describe('first'), os.describe('second')])
	.rest(os.describe('rest'));

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
