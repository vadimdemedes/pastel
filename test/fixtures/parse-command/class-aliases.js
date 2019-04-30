import React from 'react';
import PropTypes from 'prop-types';

/// Description
class Demo extends React.Component {
	static propTypes = {
		arg: PropTypes.string
	}

	static shortFlags = {
		arg: 'a'
	}

	static aliases = {
		arg: ['renamedArg']
	}

	render() {
		return null;
	}
}

export default Demo;
