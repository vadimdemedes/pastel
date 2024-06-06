import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const isDefault = true;
export const description = 'Deploy command';

export const options = zod.object({
	name: zod.string().describe('Name'),
});

type Properties = {
	readonly options: zod.infer<typeof options>;
};

export default function Deploy({options}: Properties) {
	return <Text>Deploy {options.name}</Text>;
}
