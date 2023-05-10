import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const description = 'Index command';

export const positionalArguments = z.tuple([
	z.string().describe('name'),
	z.string().describe('size'),
]);

type Props = {
	positionalArguments: z.infer<typeof positionalArguments>;
};

export default function Index({positionalArguments}: Props) {
	return <Text>Arguments = {positionalArguments.join(', ')}</Text>;
}
