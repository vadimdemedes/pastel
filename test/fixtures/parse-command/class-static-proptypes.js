import React from 'react';
import PropTypes from 'prop-types';

// Description
class Demo extends React.Component {
	static propTypes = {
		arg: PropTypes.string
	}

	static defaultProps = {
		arg: 'test'
	}

	render() {
		return null;
	}
}

export default Demo;
