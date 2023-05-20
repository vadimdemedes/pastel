import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const isDefault = true;
export const description = 'Deploy command';

export const options = zod.object({
	name: zod.string().describe('Name'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Deploy({options}: Props) {
	return <Text>Deploy {options.name}</Text>;
}
