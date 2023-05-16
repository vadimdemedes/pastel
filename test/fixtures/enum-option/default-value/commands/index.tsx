import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const options = z.object({
	os: z
		.enum(['Ubuntu', 'Debian'])
		.default('Ubuntu')
		.describe('Operating system'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>OS = {options.os}</Text>;
}
