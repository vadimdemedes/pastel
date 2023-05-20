import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	os: z
		.enum(['Ubuntu', 'Debian'])
		.default('Ubuntu')
		.describe('Operating system'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>OS = {options.os}</Text>;
}
