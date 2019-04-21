import PropTypes from 'prop-types';

// Description
const Demo = () => null;

Demo.propTypes = {
	// String arg
	stringArg: PropTypes.string.isRequired,
	// Boolean arg
	booleanArg: PropTypes.bool,
	// Number arg
	numberArg: PropTypes.number,
	// Array arg
	arrayArg: PropTypes.array
};

Demo.defaultProps = {
	stringArg: 'string',
	booleanArg: false,
	numberArg: 0,
	arrayArg: ['a', 'b', false, 0]
};

export default Demo;
