import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	os: z
		.enum(['Ubuntu', 'Debian'])
		.default('Ubuntu')
		.describe(
			option({
				description: 'Operating system',
				defaultValueDescription: 'Canonical',
			}),
		),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>OS = {options.os}</Text>;
}
