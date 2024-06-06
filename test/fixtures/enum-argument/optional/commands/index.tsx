import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

const os = zod.enum(['Ubuntu', 'Debian']).optional();

export const args = zod.tuple([os.describe('first'), os.describe('second')]);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
