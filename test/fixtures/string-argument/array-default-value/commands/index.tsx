import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod
	.array(zod.string())
	.default(['Jane', 'Hopper'])
	.describe('traits');

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
