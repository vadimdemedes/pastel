import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	force: zod.boolean().default(true).describe('Force'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	return <Text>Force = {String(options.force)}</Text>;
}
