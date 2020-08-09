import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from 'ink';

/// Positional args command
const PositionalArgs = ({message, otherMessage, inputArgs, restMessages}) => (
	<Box flexDirection="column">
		<Text>message: {message}</Text>
		<Text>otherMessage: {otherMessage}</Text>
		<Text>restMessages: {JSON.stringify(restMessages)}</Text>
		<Text>inputArgs: {JSON.stringify(inputArgs)}</Text>
	</Box>
);

PositionalArgs.propTypes = {
	/// Rest of the messages
	restMessages: PropTypes.array,
	/// Message
	message: PropTypes.string.isRequired,
	/// Other message
	otherMessage: PropTypes.string,
	/// Input args
	inputArgs: PropTypes.array
};

PositionalArgs.positionalArgs = ['message', 'otherMessage', 'restMessages'];

export default PositionalArgs;
