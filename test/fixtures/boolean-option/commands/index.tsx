import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const description = 'Index command';

export const options = z.object({
	force: z.boolean().describe('Force'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Force = {String(options.force)}</Text>;
}
