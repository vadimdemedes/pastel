import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const options = z.object({
	firstName: z.string().describe('Name'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.firstName}</Text>;
}
