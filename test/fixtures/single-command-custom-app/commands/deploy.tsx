import React from 'react';
import {Text} from 'ink';
import {z} from 'zod';

export const isDefault = true;
export const description = 'Deploy command';

export const options = z.object({
	name: z.string().describe('Name'),
});

type Props = {
	options: z.infer<typeof options>;
};

export default function Deploy({options}: Props) {
	return <Text>Deploy {options.name}</Text>;
}
