import React from 'react';
import PropTypes from 'prop-types';

/// Description
class Demo extends React.Component {
	static propTypes = {
		variadicArg: PropTypes.array,
		arg: PropTypes.string
	}

	static positionalArgs = ['arg', 'variadicArg']

	render() {
		return null;
	}
}

export default Demo;
