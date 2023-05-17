import React from 'react';
import {Box} from 'ink';
import {AppProps} from '../../../../source/index.js';

export default function CustomApp({Component, commandProps}: AppProps) {
	return (
		<Box padding={2}>
			<Component {...commandProps} />
		</Box>
	);
}
