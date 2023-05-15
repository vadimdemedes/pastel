import test from 'ava';
import run from './helpers/run';

test('string option', async t => {
	const fixture = 'string-option';

	const valid = await run(fixture, ['--name', 'Jane']);
	t.is(valid.stdout, 'Name = Jane');

	await t.throwsAsync(() => run(fixture), {
		message: /Required at "name"/,
	});

	await t.throwsAsync(() => run(fixture, ['--name', '123']), {
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
			`  --name <value>  Name`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name [value]  Name`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --name [value]  Name (default: "Mike")`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
		].join('\n'),
	);
});

test('number option', async t => {
	const fixture = 'number-option';

	const valid = await run(fixture, ['--size', '512']);
	t.is(valid.stdout, 'Size = 512');

	await t.throwsAsync(() => run(fixture), {
		message: /Required at "size"/,
	});

	await t.throwsAsync(() => run(fixture, ['--size', 'xyz']), {
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
			`  --size <value>  Size`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size [value]  Size`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --size [value]  Size (default: 128)`,
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
		].join('\n'),
	);
});

test('boolean option', async t => {
	const fixture = 'boolean-option';

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	// const disabled = await run(fixture, ['--no-force']);
	// t.is(disabled.stdout, 'Force = false');

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

test('boolean option with default value', async t => {
	const fixture = 'boolean-option-with-default-value';

	const initial = await run(fixture);
	t.is(initial.stdout, 'Force = true');

	const enabled = await run(fixture, ['--force']);
	t.is(enabled.stdout, 'Force = true');

	// const disabled = await run(fixture, ['--no-force']);
	// t.is(disabled.stdout, 'Force = false');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --force        Force (default: true)`,
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
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
		message: /Required at "os"/,
	});

	await t.throwsAsync(() => run(fixture, ['--os', 'Windows']), {
		message:
			/error: option '--os <value>' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
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
			'  --os <value>   Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
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
		message:
			/error: option '--os \[value\]' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
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
			'  --os [value]   Operating system (choices: "Ubuntu", "Debian")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
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
		message:
			/error: option '--os \[value\]' argument 'Windows' is invalid\. Allowed choices are Ubuntu, Debian\./,
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
			'  --os [value]   Operating system (choices: "Ubuntu", "Debian", default:',
			'                 "Ubuntu")',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
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
			`  --tag <value...>  Tags`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [value...]  Tags`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [value...]  Tags (default: ["A","B"])`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			`  --tag <value...>  Tags`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [value...]  Tags`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			'Usage: test [options]',
			'',
			'Description',
			'',
			'Options:',
			`  --tag [value...]  Tags (default: ["A","B"])`,
			`  -v, --version     Show version number`,
			`  -h, --help        Show help`,
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
			'  --name [value]  Name',
			`  -v, --version   Show version number`,
			`  -h, --help      Show help`,
		].join('\n'),
	);
});
