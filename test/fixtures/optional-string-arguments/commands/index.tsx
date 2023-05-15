import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const positionalArguments = z.tuple([
	z.string().describe('name').optional(),
	z.string().describe('size').default('xl'),
]);

type Props = {
	positionalArguments: z.infer<typeof positionalArguments>;
};

export default function Index({positionalArguments}: Props) {
	return <Text>Arguments = {positionalArguments.join(', ')}</Text>;
}
