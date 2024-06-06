import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.tuple([
	zod.string().optional().describe('name'),
	zod.string().optional().describe('surname'),
]);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
