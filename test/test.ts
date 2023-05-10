import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execaNode, ExecaChildProcess} from 'execa';

const run = async (
	fixture: string,
	args: string[] = [],
): Promise<ExecaChildProcess> => {
	const cliPath = fileURLToPath(
		new URL(`fixtures/${fixture}/cli.ts`, import.meta.url),
	);

	return execaNode(cliPath, ['--loader', 'ts-node/esm', ...args]);
};

test('single command', async t => {
	const {stdout} = await run('single-command');
	t.is(stdout, 'Index');
});

test('single command - help', async t => {
	const {stdout} = await run('single-command', ['--help']);

	t.is(
		stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
		].join('\n'),
	);
});

test('multiple commands', async t => {
	const index = await run('multiple-commands');
	t.is(index.stdout, 'Index');

	const auth = await run('multiple-commands', ['auth']);
	t.is(auth.stdout, 'Auth');
});

test('multiple commands - help', async t => {
	const index = await run('multiple-commands', ['--help']);

	t.is(
		index.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Commands:',
			'  test auth  Auth command',
			`  test       Index command${' '.repeat(45)}[default]`,
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
		].join('\n'),
	);

	const auth = await run('multiple-commands', ['auth', '--help']);

	t.is(
		auth.stdout,
		[
			'test auth',
			'',
			'Auth command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
		].join('\n'),
	);
});

test('nested commands', async t => {
	const fixture = 'nested-commands';

	const index = await run(fixture);
	t.is(index.stdout, 'Index');

	const auth = await run(fixture, ['auth']);
	t.is(auth.stdout, 'Auth');

	const servers = await run(fixture, ['servers']);

	t.is(
		servers.stdout,
		[
			'test servers',
			'',
			'Manage servers',
			'',
			'Commands:',
			'  test servers create  Create server',
			`  test servers         Manage servers${' '.repeat(34)}[default]`,
			'  test servers list    List servers',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
		].join('\n'),
	);

	const createServer = await run(fixture, ['servers', 'create']);
	t.is(createServer.stdout, 'Create server');

	const listServers = await run(fixture, ['servers', 'list']);
	t.is(listServers.stdout, 'List servers');
});

test('string option', async t => {
	const fixture = 'string-option';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	await t.throwsAsync(() => run(fixture), {
		message: /Missing required argument: name/,
	});

	await t.throwsAsync(() => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --name     Name${' '.repeat(44)}[string] [required]`,
		].join('\n'),
	);
});

test('optional string option', async t => {
	const fixture = 'optional-string-option';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = empty');

	await t.throwsAsync(() => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --name     Name${' '.repeat(55)}[string]`,
		].join('\n'),
	);
});

test('string option with default value', async t => {
	const fixture = 'string-option-with-default-value';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = Mike');

	await t.throwsAsync(() => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --name     Name${' '.repeat(37)}[string] [default: "Mike"]`,
		].join('\n'),
	);
});

test('number option', async t => {
	const fixture = 'number-option';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	await t.throwsAsync(() => run(fixture), {
		message: /Missing required argument: size/,
	});

	await t.throwsAsync(() => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --size     Size${' '.repeat(44)}[number] [required]`,
		].join('\n'),
	);
});

test('optional number option', async t => {
	const fixture = 'optional-number-option';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Size = -1');

	await t.throwsAsync(() => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --size     Size${' '.repeat(55)}[number]`,
		].join('\n'),
	);
});

test('number option with default value', async t => {
	const fixture = 'number-option-with-default-value';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Size = 128');

	await t.throwsAsync(() => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --size     Size${' '.repeat(40)}[number] [default: 128]`,
		].join('\n'),
	);
});

test('boolean option', async t => {
	const fixture = 'boolean-option';

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	const disabled = await run(fixture, ['--no-force']);
	t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --force    Force${' '.repeat(36)}[boolean] [default: false]`,
		].join('\n'),
	);
});

test('boolean option with default value', async t => {
	const fixture = 'boolean-option-with-default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Force = true');

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	const disabled = await run(fixture, ['--no-force']);
	t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --force    Force${' '.repeat(37)}[boolean] [default: true]`,
		].join('\n'),
	);
});

test('enum option', async t => {
	const fixture = 'enum-option';

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(() => run(fixture), {
		message: /Missing required argument: os/,
	});

	await t.throwsAsync(() => run(fixture, ['--os', 'Windows']), {
		message: /Argument: os, Given: "Windows", Choices: "Ubuntu", "Debian"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			'  --os       Operating system  [string] [required] [choices: "Ubuntu", "Debian"]',
		].join('\n'),
	);
});

test('optional enum option', async t => {
	const fixture = 'optional-enum-option';

	const initial = await run(fixture);
	t.is(initial.stdout, 'OS = empty');

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(() => run(fixture, ['--os', 'Windows']), {
		message: /Argument: os, Given: "Windows", Choices: "Ubuntu", "Debian"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --os       Operating system${' '.repeat(
				13,
			)}[string] [choices: "Ubuntu", "Debian"]`,
		].join('\n'),
	);
});

test('enum option with default value', async t => {
	const fixture = 'enum-option-with-default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'OS = Ubuntu');

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(() => run(fixture, ['--os', 'Windows']), {
		message: /Argument: os, Given: "Windows", Choices: "Ubuntu", "Debian"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			'  --os       Operating system',
			'                      [string] [choices: "Ubuntu", "Debian"] [default: "Ubuntu"]',
		].join('\n'),
	);
});

test('array option', async t => {
	const fixture = 'array-option';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(() => run(fixture), {
		message: /Missing required argument: tag/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(45)}[array] [required]`,
		].join('\n'),
	);
});

test('optional array option', async t => {
	const fixture = 'optional-array-option';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Tags =');

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(56)}[array]`,
		].join('\n'),
	);
});

test('array option with default value', async t => {
	const fixture = 'array-option-with-default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Tags = A, B');

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(56)}[array]`,
		].join('\n'),
	);
});

test('set option', async t => {
	const fixture = 'set-option';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(() => run(fixture), {
		message: /Missing required argument: tag/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(45)}[array] [required]`,
		].join('\n'),
	);
});

test('optional set option', async t => {
	const fixture = 'optional-set-option';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Tags =');

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(56)}[array]`,
		].join('\n'),
	);
});

test('set option with default value', async t => {
	const fixture = 'set-option-with-default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Tags = A, B');

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --tag      Tags${' '.repeat(56)}[array]`,
		].join('\n'),
	);
});

test('all optional options', async t => {
	const fixture = 'all-optional-options';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = empty');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'test',
			'',
			'Index command',
			'',
			'Options:',
			`  --version  Show version number${' '.repeat(39)}[boolean]`,
			`  --help     Show help${' '.repeat(49)}[boolean]`,
			`  --name     Name${' '.repeat(55)}[string]`,
		].join('\n'),
	);
});
