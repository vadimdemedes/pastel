import PropTypes from 'prop-types';

/// Description
const Demo = () => null;

Demo.propTypes = {
	arg: PropTypes.string.isRequired,
	optionalArg: PropTypes.string
};

Demo.positionalArgs = ['optionalArg', 'arg'];

export default Demo;
