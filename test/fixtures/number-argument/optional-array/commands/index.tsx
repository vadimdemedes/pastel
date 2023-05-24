import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.array(zod.number()).optional().describe('number');

type Props = {
	args: zod.infer<typeof args>;
};

export default function Index({args}: Props) {
	return <Text>Arguments = {args?.join(', ') ?? ''}</Text>;
}
