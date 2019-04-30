import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from 'ink';

/// Positional args command
const PositionalArgs = ({message, otherMessage, inputArgs}) => (
	<Box flexDirection="column">
		<Text>message: {message}</Text>
		<Text>otherMessage: {otherMessage}</Text>
		<Text>inputArgs: {JSON.stringify(inputArgs)}</Text>
	</Box>
);

PositionalArgs.propTypes = {
	/// Message
	message: PropTypes.string,
	/// Other message
	otherMessage: PropTypes.string,
	/// Input args
	inputArgs: PropTypes.array
};

PositionalArgs.positionalArgs = ['message', 'otherMessage'];

export default PositionalArgs;
