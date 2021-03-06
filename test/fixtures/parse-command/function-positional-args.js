import PropTypes from 'prop-types';

/// Description
const Demo = () => null;

Demo.propTypes = {
	optionalArg: PropTypes.string,
	arg: PropTypes.string.isRequired
};

Demo.positionalArgs = ['arg', 'optionalArg'];

export default Demo;
