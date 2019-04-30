import PropTypes from 'prop-types';

/// Description
const Demo = () => null;

Demo.propTypes = {
	arg: PropTypes.string
};

Demo.shortFlags = {
	arg: 'a'
};

Demo.aliases = {
	arg: ['renamedArg']
};

export default Demo;
