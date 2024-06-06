import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const options = zod.object({
	force: zod.boolean().describe('Force'),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Index({options}: Properties) {
	return <Text>Force = {String(options.force)}</Text>;
}
