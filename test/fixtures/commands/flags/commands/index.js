import React from 'react';
import PropTypes from 'prop-types';
import {Box, Text} from 'ink';

/// Flags command
const Flags = ({stringArg, booleanArg, numberArg, arrayArg}) => (
	<Box flexDirection="column">
		<Text>stringArg: {stringArg}</Text>
		<Text>booleanArg: {String(booleanArg)}</Text>
		<Text>numberArg: {numberArg}</Text>
		<Text>arrayArg: {JSON.stringify(arrayArg)}</Text>
	</Box>
);

Flags.propTypes = {
	/// String arg
	stringArg: PropTypes.string.isRequired,
	/// Boolean arg
	booleanArg: PropTypes.bool,
	/// Number arg
	numberArg: PropTypes.number,
	/// Array arg
	arrayArg: PropTypes.array
};

Flags.defaultProps = {
	stringArg: 'string',
	booleanArg: false,
	numberArg: 0,
	arrayArg: ['a', 'b', false, 0]
};

export default Flags;
