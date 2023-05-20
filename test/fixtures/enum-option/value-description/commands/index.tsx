import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from '../../../../../source/index.js';

export const options = zod.object({
	os: zod.enum(['Ubuntu', 'Debian']).describe(
		option({
			description: 'Operating system',
			valueDescription: 'OS',
		}),
	),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>OS = {options.os}</Text>;
}
