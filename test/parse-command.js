import path from 'path';
import test from 'ava';
import parseCommand from '../lib/parse-command';

const fixture = name => path.join(__dirname, 'fixtures', 'parse-command', `${name}.js`);

test('parse arrow function', async t => {
	const command = await parseCommand(fixture('arrow-function'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse arrow function with default export', async t => {
	const command = await parseCommand(fixture('arrow-function-export-default'));

	t.deepEqual(command, {
		description: 'Description',
		args: []
	});
});

test('parse named function', async t => {
	const command = await parseCommand(fixture('named-function'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse named function with default export', async t => {
	const command = await parseCommand(fixture('named-function-export-default'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse class', async t => {
	const command = await parseCommand(fixture('class'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse class with static prop types', async t => {
	const command = await parseCommand(fixture('class-static-proptypes'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: 'test',
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse class with default export', async t => {
	const command = await parseCommand(fixture('class-export-default'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse prop types', async t => {
	const command = await parseCommand(fixture('prop-types'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'stringArg',
				type: 'string',
				description: 'String arg',
				isRequired: true,
				defaultValue: 'string',
				aliases: [],
				positional: false
			},
			{
				key: 'booleanArg',
				type: 'boolean',
				description: 'Boolean arg',
				isRequired: false,
				defaultValue: false,
				aliases: [],
				positional: false
			},
			{
				key: 'numberArg',
				type: 'number',
				description: 'Number arg',
				isRequired: false,
				defaultValue: 0,
				aliases: [],
				positional: false
			},
			{
				key: 'arrayArg',
				type: 'array',
				description: 'Array arg',
				isRequired: false,
				defaultValue: ['a', 'b', false, 0],
				aliases: [],
				positional: false
			}
		]
	});
});

test('parse function aliases and short flags', async t => {
	const command = await parseCommand(fixture('function-aliases'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: ['a', 'renamedArg'],
				positional: false
			}
		]
	});
});

test('parse class aliases and short flags', async t => {
	const command = await parseCommand(fixture('class-aliases'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: ['a', 'renamedArg'],
				positional: false
			}
		]
	});
});

test('parse function positional args', async t => {
	const command = await parseCommand(fixture('function-positional-args'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: true
			}
		]
	});
});

test('parse class positional args', async t => {
	const command = await parseCommand(fixture('class-positional-args'));

	t.deepEqual(command, {
		description: 'Description',
		args: [
			{
				key: 'arg',
				type: 'string',
				description: '',
				isRequired: false,
				defaultValue: undefined,
				aliases: [],
				positional: true
			}
		]
	});
});
