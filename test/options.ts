import test from 'ava';
import run from './helpers/run.js';

test('string option', async t => {
	const fixture = 'string-option/required';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "name"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name <name>  Name`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional string option', async t => {
	const fixture = 'string-option/optional';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = empty');

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name [name]  Name`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string option with default value', async t => {
	const fixture = 'string-option/default-value';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = Mike');

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name [name]  Name (default: "Mike")`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string option with default value and custom description', async t => {
	const fixture = 'string-option/default-value-description';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Name = Mike');

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name [name]  Name (default: Mike)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string option with description from `option`', async t => {
	const fixture = 'string-option/description';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "name"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name <name>  Name`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string option with custom value description', async t => {
	const fixture = 'string-option/value-description';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "name"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name <first-name>  Name`,
			`  -v, --version        Show version number`,
			`  -h, --help           Show help`,
		].join('\n'),
	);
});

test('string option with alias', async t => {
	const fixture = 'string-option/alias';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const alias = await run(fixture, ['-n', 'Jane']);
	t.is(alias.stdout, 'Name = Jane');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "name"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--name', '123']), {
		message: /Invalid value at "name"/,
	});

	await t.throwsAsync(async () => run(fixture, ['-n', '123']), {
		message: /Invalid value at "name"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  -n, --name <name>  Name`,
			`  -v, --version      Show version number`,
			`  -h, --help         Show help`,
		].join('\n'),
	);
});

test('number option', async t => {
	const fixture = 'number-option/required';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "size"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size <size>  Size`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional number option', async t => {
	const fixture = 'number-option/optional';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Size = -1');

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size [size]  Size`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number option with default value', async t => {
	const fixture = 'number-option/default-value';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Size = 128');

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size [size]  Size (default: 128)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number option with default value and custom description', async t => {
	const fixture = 'number-option/default-value-description';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const empty = await run(fixture);
	t.is(empty.stdout, 'Size = 128');

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size [size]  Size (default: 128 MB)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number option with description from `option`', async t => {
	const fixture = 'number-option/description';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "size"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size <size>  Size`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number option with custom value description', async t => {
	const fixture = 'number-option/value-description';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "size"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size <some-size>  Size`,
			`  -v, --version       Show version number`,
			`  -h, --help          Show help`,
		].join('\n'),
	);
});

test('number option with alias', async t => {
	const fixture = 'number-option/alias';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	const alias = await run(fixture, ['-s', '512']);
	t.is(alias.stdout, 'Size = 512');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "size"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--size', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	await t.throwsAsync(async () => run(fixture, ['-s', 'xyz']), {
		message: /Expected number, received nan at "size"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  -s, --size <size>  Size`,
			`  -v, --version      Show version number`,
			`  -h, --help         Show help`,
		].join('\n'),
	);
});

test('boolean option', async t => {
	const fixture = 'boolean-option/default';

	const disabled = await run(fixture);
	t.is(disabled.stdout, 'Force = false');

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --force        Force (default: false)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('negated boolean option', async t => {
	const fixture = 'boolean-option/negated';

	const enabled = await run(fixture);
	t.is(enabled.stdout, 'Force = true');

	const disabled = await run(fixture, ['--no-force']);
	t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --no-force     Don't force`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('boolean option with description from `option`', async t => {
	const fixture = 'boolean-option/description';

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	const disabled = await run(fixture);
	t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --force        Force (default: false)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('boolean option with alias', async t => {
	const fixture = 'boolean-option/alias';

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	const alias = await run(fixture, ['-f']);
	t.is(alias.stdout, 'Force = true');

	const disabled = await run(fixture);
	t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  -f, --force    Force (default: false)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option', async t => {
	const fixture = 'enum-option/required';

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "os"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os <os>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os <os>      Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional enum option', async t => {
	const fixture = 'enum-option/optional';

	const initial = await run(fixture);
	t.is(initial.stdout, 'OS = empty');

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os \[os]' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os [os]      Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option with default value', async t => {
	const fixture = 'enum-option/default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'OS = Ubuntu');

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os \[os]' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os [os]      Operating system (choices: "Ubuntu", "Debian", default:',
			'                 "Ubuntu")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option with default value and custom description', async t => {
	const fixture = 'enum-option/default-value-description';

	const initial = await run(fixture);
	t.is(initial.stdout, 'OS = Ubuntu');

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os \[os]' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os [os]      Operating system (choices: "Ubuntu", "Debian", default:',
			'                 Canonical)',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option with description from `option`', async t => {
	const fixture = 'enum-option/description';

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "os"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os <os>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os <os>      Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option with custom value description', async t => {
	const fixture = 'enum-option/value-description';

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "os"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os <OS>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --os <OS>      Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum option with alias', async t => {
	const fixture = 'enum-option/alias';

	const ubuntu = await run(fixture, ['--os', 'Ubuntu']);
	t.is(ubuntu.stdout, 'OS = Ubuntu');

	const debian = await run(fixture, ['--os', 'Debian']);
	t.is(debian.stdout, 'OS = Debian');

	const alias = await run(fixture, ['-s', 'Debian']);
	t.is(alias.stdout, 'OS = Debian');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "os"/,
	});

	await t.throwsAsync(async () => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '-s, --os <os>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	await t.throwsAsync(async () => run(fixture, ['-s', 'Windows']), {
		message:
			/error: option '-s, --os <os>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  -s, --os <os>  Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('array option', async t => {
	const fixture = 'array-option/required';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag <tags...>  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('optional array option', async t => {
	const fixture = 'array-option/optional';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('array option with default value', async t => {
	const fixture = 'array-option/default-value';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags (default: ["A","B"])`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('array option with default value and custom description', async t => {
	const fixture = 'array-option/default-value-description';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags (default: A, B)`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('array option with description from `option`', async t => {
	const fixture = 'array-option/description';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag <tags...>  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('array option with alias', async t => {
	const fixture = 'array-option/alias';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const oneAlias = await run(fixture, ['-t', 'X']);
	t.is(oneAlias.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoAlias = await run(fixture, ['-t', 'X', '-t', 'Y']);
	t.is(twoAlias.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const twoWithSpacesAlias = await run(fixture, ['-t', 'X', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const mixed = await run(fixture, ['-t', 'X', '--tag', 'Y']);
	t.is(mixed.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  -t, --tag <tags...>  Tags`,
			`  -v, --version        Show version number`,
			`  -h, --help           Show help`,
		].join('\n'),
	);
});

test('set option', async t => {
	const fixture = 'set-option/required';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag <tags...>  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('optional set option', async t => {
	const fixture = 'set-option/optional';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('set option with default value', async t => {
	const fixture = 'set-option/default-value';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags (default: ["A","B"])`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('set option with default value and custom description', async t => {
	const fixture = 'set-option/default-value-description';

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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [tags...]  Tags (default: A, B)`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('set option with description from `option`', async t => {
	const fixture = 'set-option/description';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag <tags...>  Tags`,
			`  -v, --version    Show version number`,
			`  -h, --help       Show help`,
		].join('\n'),
	);
});

test('set option with custom value description', async t => {
	const fixture = 'set-option/value-description';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag <some-tags...>  Tags`,
			`  -v, --version         Show version number`,
			`  -h, --help            Show help`,
		].join('\n'),
	);
});

test('set option with alias', async t => {
	const fixture = 'set-option/alias';

	const one = await run(fixture, ['--tag', 'X']);
	t.is(one.stdout, 'Tags = X');

	const oneAlias = await run(fixture, ['-t', 'X']);
	t.is(oneAlias.stdout, 'Tags = X');

	const two = await run(fixture, ['--tag', 'X', '--tag', 'Y', '--tag', 'Y']);
	t.is(two.stdout, 'Tags = X, Y');

	const twoAlias = await run(fixture, ['-t', 'X', '-t', 'Y', '-t', 'Y']);
	t.is(twoAlias.stdout, 'Tags = X, Y');

	const twoWithSpaces = await run(fixture, ['--tag', 'X', 'Y', 'Y']);
	t.is(twoWithSpaces.stdout, 'Tags = X, Y');

	const twoWithSpacesAlias = await run(fixture, ['-t', 'X', 'Y', 'Y']);
	t.is(twoWithSpacesAlias.stdout, 'Tags = X, Y');

	const mixed = await run(fixture, ['-t', 'X', '--tag', 'Y', '-t', 'Y']);
	t.is(mixed.stdout, 'Tags = X, Y');

	await t.throwsAsync(async () => run(fixture), {
		message: /Required at "tag"/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  -t, --tag <tags...>  Tags`,
			`  -v, --version        Show version number`,
			`  -h, --help           Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --name [name]  Name',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('snake case option name', async t => {
	const fixture = 'camelcase-option';

	const valid = await run(fixture, ['--first-name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			'  --first-name <first-name>  Name',
			`  -v, --version              Show version number`,
			`  -h, --help                 Show help`,
		].join('\n'),
	);
});
