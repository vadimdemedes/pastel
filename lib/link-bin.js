'use strict';
const hasYarn = require('has-yarn');
const execa = require('execa');

module.exports = projectPath => {
	const bin = hasYarn(projectPath) ? 'yarn' : 'npm';

	return execa(bin, ['link']);
};
