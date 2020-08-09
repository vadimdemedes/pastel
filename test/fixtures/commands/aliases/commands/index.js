import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from 'ink';

/// Aliases command
const Aliases = ({stream, newArg, positional}) => (
	<Box flexDirection="column">
		<Text>stream: {stream}</Text>
		<Text>newArg: {newArg}</Text>
	</Box>
);

Aliases.propTypes = {
	/// Stream arg
	stream: PropTypes.string,
	/// New arg
	newArg: PropTypes.string,
	/// Positional arg
	positional: PropTypes.string
};

Aliases.shortFlags = {
	stream: 's'
};

Aliases.positionalArgs = ['positional'];

Aliases.aliases = {
	newArg: ['oldArg'],
	positional: 'otherName'
};

export default Aliases;
