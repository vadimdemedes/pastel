import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.tuple([zod.string().describe('firstName')]);

type Properties = {
	readonly args: zod.infer<typeof args>;
};

export default function Index({args}: Properties) {
	return <Text>Arguments = {args.join(', ')}</Text>;
}
