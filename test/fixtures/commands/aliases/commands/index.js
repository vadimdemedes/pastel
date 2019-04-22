import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from 'ink';

// Aliases command
const Aliases = ({stream, newArg}) => (
	<Box flexDirection="column">
		<Text>stream: {stream}</Text>
		<Text>newArg: {newArg}</Text>
	</Box>
);

Aliases.propTypes = {
	// Stream arg
	stream: PropTypes.string,
	// New arg
	newArg: PropTypes.string
};

Aliases.shortFlags = {
	stream: 's'
};

Aliases.aliases = {
	newArg: ['oldArg']
};

export default Aliases;
