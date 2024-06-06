import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	os: zod
		.enum(['Ubuntu', 'Debian'])
		.default('Ubuntu')
		.describe('Operating system'),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>OS = {options.os}</Text>;
}
