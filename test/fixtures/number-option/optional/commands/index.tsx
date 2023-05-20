import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	size: zod.number().optional().describe('Size'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Size = {options.size ?? -1}</Text>;
}
