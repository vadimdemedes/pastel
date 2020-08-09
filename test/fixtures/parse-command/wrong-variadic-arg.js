import PropTypes from 'prop-types';

/// Description
const Demo = () => null;

Demo.propTypes = {
	arg: PropTypes.string,
	variadicArg: PropTypes.array
};

Demo.positionalArgs = ['variadicArg', 'arg'];

export default Demo;
