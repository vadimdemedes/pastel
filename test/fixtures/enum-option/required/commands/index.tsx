import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	os: zod.enum(['Ubuntu', 'Debian']).describe('Operating system'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>OS = {options.os}</Text>;
}
