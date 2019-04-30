'use strict';
const {promisify} = require('util');
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');

const readFile = promisify(fs.readFile);

// List of supported types in `prop-types` package
const propTypes = [
	'array',
	'bool',
	'number',
	'string'
];

const parseDescription = comments => {
	if (!Array.isArray(comments)) {
		return '';
	}

	return comments
		.filter(comment => comment.value.startsWith('/'))
		.map(comment => comment.value.slice(1).trim())
		.join(' ');
};

const parsePropType = property => {
	const key = property.key.name;
	const description = parseDescription(property.leadingComments);
	let type = 'string';
	let isRequired = false;

	const walk = node => {
		if (types.isMemberExpression(node)) {
			if (types.isIdentifier(node.property)) {
				if (propTypes.includes(node.property.name)) {
					type = node.property.name;
				}

				if (node.property.name === 'isRequired') {
					isRequired = true;
				}
			}

			// Need to walk the whole node recursively to catch all types of `PropTypes.a.b.c` chain
			// like `isRequired`, e.g. `PropTypes.string.isRequired`
			walk(node.object);
		}

		// If child node of `PropTypes...` chain is a call expression, it must be a
		// prop type like `arrayOf`, e.g. `PropTypes.arrayOf(PropTypes.string)`
		if (types.isCallExpression(node)) {
			if (types.isMemberExpression(node.callee.object)) {
				walk(node.callee.object);
			}
		}
	};

	walk(property.value);

	// Rename `bool` type to `boolean` for yargs to correctly recognize the type
	if (type === 'bool') {
		type = 'boolean';
	}

	return {key, type, description, isRequired};
};

const parsePropTypes = node => {
	if (!types.isObjectExpression(node)) {
		return [];
	}

	const propTypes = [];

	for (const property of node.properties) {
		propTypes.push(parsePropType(property));
	}

	return propTypes;
};

const parseDefaultProps = node => {
	if (!types.isObjectExpression(node)) {
		return {};
	}

	const defaultProps = {};

	for (const property of node.properties) {
		if (types.isArrayExpression(property.value)) {
			const defaultValue = [];

			for (const element of property.value.elements) {
				if (types.isLiteral(element)) {
					defaultValue.push(element.value);
				}
			}

			defaultProps[property.key.name] = defaultValue;
		}

		if (types.isLiteral(property.value)) {
			defaultProps[property.key.name] = property.value.value;
		}
	}

	return defaultProps;
};

const parseAliases = node => {
	if (!types.isObjectExpression(node)) {
		return {};
	}

	const aliases = {};

	for (const property of node.properties) {
		if (!Array.isArray(aliases[property.key.name])) {
			aliases[property.key.name] = [];
		}

		if (types.isStringLiteral(property.value)) {
			aliases[property.key.name].push(property.value.value);
		}

		if (types.isArrayExpression(property.value)) {
			for (const element of property.value.elements) {
				if (types.isStringLiteral(element)) {
					aliases[property.key.name].push(element.value);
				}
			}
		}
	}

	return aliases;
};

const parsePositionalArgs = node => {
	if (!types.isArrayExpression(node)) {
		return [];
	}

	const positionalArgs = [];

	for (const element of node.elements) {
		if (types.isStringLiteral(element)) {
			positionalArgs.push(element.value);
		}
	}

	return positionalArgs;
};

const mergeAliases = (existingAliases, newAliases) => {
	for (const key of Object.keys(newAliases)) {
		if (Array.isArray(existingAliases[key])) {
			existingAliases[key].push(...newAliases[key]);
		} else {
			existingAliases[key] = newAliases[key];
		}
	}
};

module.exports = async filePath => {
	const source = await readFile(filePath, 'utf8');

	let ast;

	try {
		ast = parser.parse(source, {
			sourceType: 'unambiguous',
			plugins: ['jsx', 'classProperties']
		});
	} catch (error) {
		// Silence error and let Parcel catch the same syntax error and report it
		return {};
	}

	let componentName;
	let description = '';

	traverse(ast, {
		ExportDefaultDeclaration({node}) {
			if (types.isClassDeclaration(node.declaration)) {
				description = parseDescription(node.leadingComments);
				componentName = node.declaration.id.name;
				return;
			}

			if (types.isFunctionDeclaration(node.declaration)) {
				description = parseDescription(node.leadingComments);
				componentName = node.declaration.id.name;
				return;
			}

			if (types.isArrowFunctionExpression(node.declaration)) {
				description = parseDescription(node.leadingComments);
				return;
			}

			componentName = node.declaration.loc.identifierName;
		}
	});

	let defaultProps = {};
	const aliases = {};
	const args = [];
	let positionalArgs = [];

	traverse(ast, {
		// Support for arrow function components, e.g. const MyComponent = () => {}
		VariableDeclaration({node}) {
			if (node.declarations[0].id.name === componentName) {
				description = parseDescription(node.leadingComments);
			}
		},
		// Support for named function components, e.g. function MyComponent {}
		FunctionDeclaration({node}) {
			if (node.id.name === componentName) {
				if (!description) {
					description = parseDescription(node.leadingComments);
				}
			}
		},
		// Support for class components, e.g. class MyComponent extends React.Component {}
		ClassDeclaration({node}) {
			if (node.id.name === componentName) {
				if (!description) {
					description = parseDescription(node.leadingComments);
				}
			}
		},
		// Support for static class props, e.g. class MyComponent { static propTypes = ... }
		ClassProperty({node}) {
			if (node.key.name === 'propTypes') {
				args.push(...parsePropTypes(node.value));
			}

			if (node.key.name === 'defaultProps') {
				defaultProps = parseDefaultProps(node.value);
			}

			if (node.key.name === 'aliases') {
				mergeAliases(aliases, parseAliases(node.value));
			}

			if (node.key.name === 'shortFlags') {
				mergeAliases(aliases, parseAliases(node.value));
			}

			if (node.key.name === 'positionalArgs') {
				positionalArgs = parsePositionalArgs(node.value);
			}
		},
		// Support for static props for function components, e.g. MyComponent.propTypes = ...
		AssignmentExpression({node}) {
			if (node.operator !== '=' || node.left.object.name !== componentName) {
				return;
			}

			if (node.left.property.name === 'propTypes') {
				args.push(...parsePropTypes(node.right));
			}

			if (node.left.property.name === 'defaultProps') {
				defaultProps = parseDefaultProps(node.right);
			}

			if (node.left.property.name === 'aliases') {
				mergeAliases(aliases, parseAliases(node.right));
			}

			if (node.left.property.name === 'shortFlags') {
				mergeAliases(aliases, parseAliases(node.right));
			}

			if (node.left.property.name === 'positionalArgs') {
				positionalArgs = parsePositionalArgs(node.right);
			}
		}
	});

	return {
		description,
		args: args.map(arg => {
			return {
				...arg,
				defaultValue: defaultProps[arg.key],
				aliases: aliases[arg.key] || [],
				positional: positionalArgs.includes(arg.key)
			};
		})
	};
};
