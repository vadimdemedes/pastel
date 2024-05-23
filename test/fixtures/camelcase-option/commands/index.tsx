import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	firstName: zod.string().describe('Name'),
});

type Props = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Name = {options.firstName}</Text>;
}
