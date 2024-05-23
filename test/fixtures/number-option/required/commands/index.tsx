import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	size: zod.number().describe('Size'),
});

type Props = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Size = {options.size}</Text>;
}
