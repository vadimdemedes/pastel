import test from 'ava';
import run from './helpers/run';

test('string argument', async t => {
	const fixture = 'string-argument/required';

	const valid = await run(fixture, ['Jane', 'Hopper']);
	t.is(valid.stdout, 'Arguments = Jane, Hopper');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'name'/,
	});

	await t.throwsAsync(() => run(fixture, ['Jane']), {
		message: /error: missing required argument 'surname'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <name> <surname>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional string argument', async t => {
	const fixture = 'string-argument/optional';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = ,');

	const onlyOne = await run(fixture, ['Jane']);
	t.is(onlyOne.stdout, 'Arguments = Jane,');

	const both = await run(fixture, ['Jane', 'Hopper']);
	t.is(both.stdout, 'Arguments = Jane, Hopper');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [name] [surname]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string argument with default value', async t => {
	const fixture = 'string-argument/default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = , Hopper');

	const onlyOne = await run(fixture, ['Jane']);
	t.is(onlyOne.stdout, 'Arguments = Jane, Hopper');

	const both = await run(fixture, ['Jane', 'Hopper']);
	t.is(both.stdout, 'Arguments = Jane, Hopper');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [name] [surname]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('variadic string argument', async t => {
	const fixture = 'string-argument/variadic';

	const withoutVariadic = await run(fixture, ['Jane', 'Hopper']);
	t.is(withoutVariadic.stdout, 'Arguments = Jane, Hopper');

	const withVariadic = await run(fixture, [
		'Jane',
		'Hopper',
		'Eleven',
		'Hawkins',
	]);

	t.is(withVariadic.stdout, 'Arguments = Jane, Hopper, Eleven, Hawkins');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'name'/,
	});

	await t.throwsAsync(() => run(fixture, ['Jane']), {
		message: /error: missing required argument 'surname'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <name> <surname> [traits...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string array argument', async t => {
	const fixture = 'string-argument/array';

	const valid = await run(fixture, ['Jane', 'Hopper']);
	t.is(valid.stdout, 'Arguments = Jane, Hopper');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'traits'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <traits...>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional string array argument', async t => {
	const fixture = 'string-argument/optional-array';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments =');

	const valid = await run(fixture, ['Jane', 'Hopper']);
	t.is(valid.stdout, 'Arguments = Jane, Hopper');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [traits...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('string array argument with default value', async t => {
	const fixture = 'string-argument/array-default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = Jane, Hopper');

	const valid = await run(fixture, ['Jim', 'Hopper']);
	t.is(valid.stdout, 'Arguments = Jim, Hopper');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [traits...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number argument', async t => {
	const fixture = 'number-argument/required';

	const valid = await run(fixture, ['128', '256']);
	t.is(valid.stdout, 'Arguments = 128, 256');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'first'/,
	});

	await t.throwsAsync(() => run(fixture, ['128']), {
		message: /error: missing required argument 'second'/,
	});

	await t.throwsAsync(() => run(fixture, ['Jane', 'Hopper']), {
		message: /Expected number, received nan at index 0/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <first> <second>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional number argument', async t => {
	const fixture = 'number-argument/optional';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = ,');

	const onlyOne = await run(fixture, ['128']);
	t.is(onlyOne.stdout, 'Arguments = 128,');

	const both = await run(fixture, ['128', '256']);
	t.is(both.stdout, 'Arguments = 128, 256');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [first] [second]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number argument with default value', async t => {
	const fixture = 'number-argument/default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = , 256');

	const onlyOne = await run(fixture, ['128']);
	t.is(onlyOne.stdout, 'Arguments = 128, 256');

	const both = await run(fixture, ['128', '512']);
	t.is(both.stdout, 'Arguments = 128, 512');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [first] [second]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('variadic number argument', async t => {
	const fixture = 'number-argument/variadic';

	const withoutVariadic = await run(fixture, ['128', '256']);
	t.is(withoutVariadic.stdout, 'Arguments = 128, 256');

	const withVariadic = await run(fixture, ['128', '256', '512', '1024']);
	t.is(withVariadic.stdout, 'Arguments = 128, 256, 512, 1024');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'first'/,
	});

	await t.throwsAsync(() => run(fixture, ['128']), {
		message: /error: missing required argument 'second'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <first> <second> [rest...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number array argument', async t => {
	const fixture = 'number-argument/array';

	const valid = await run(fixture, ['128', '256']);
	t.is(valid.stdout, 'Arguments = 128, 256');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'number'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <number...>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional number array argument', async t => {
	const fixture = 'number-argument/optional-array';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments =');

	const valid = await run(fixture, ['128', '256']);
	t.is(valid.stdout, 'Arguments = 128, 256');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [number...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('number array argument with default value', async t => {
	const fixture = 'number-argument/array-default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = 128, 256');

	const valid = await run(fixture, ['512', '1024']);
	t.is(valid.stdout, 'Arguments = 512, 1024');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [number...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum argument', async t => {
	const fixture = 'enum-argument/required';

	const valid = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(valid.stdout, 'Arguments = Ubuntu, Debian');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'first'/,
	});

	await t.throwsAsync(() => run(fixture, ['Ubuntu']), {
		message: /error: missing required argument 'second'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <first> <second>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional enum argument', async t => {
	const fixture = 'enum-argument/optional';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = ,');

	const onlyOne = await run(fixture, ['Ubuntu']);
	t.is(onlyOne.stdout, 'Arguments = Ubuntu,');

	const both = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(both.stdout, 'Arguments = Ubuntu, Debian');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [first] [second]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum argument with default value', async t => {
	const fixture = 'enum-argument/default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = , Debian');

	const onlyOne = await run(fixture, ['Ubuntu']);
	t.is(onlyOne.stdout, 'Arguments = Ubuntu, Debian');

	const both = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(both.stdout, 'Arguments = Ubuntu, Debian');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [first] [second]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('variadic enum argument', async t => {
	const fixture = 'enum-argument/variadic';

	const withoutVariadic = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(withoutVariadic.stdout, 'Arguments = Ubuntu, Debian');

	const withVariadic = await run(fixture, [
		'Ubuntu',
		'Debian',
		'macOS',
		'Windows',
	]);

	t.is(withVariadic.stdout, 'Arguments = Ubuntu, Debian, macOS, Windows');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'first'/,
	});

	await t.throwsAsync(() => run(fixture, ['Ubuntu']), {
		message: /error: missing required argument 'second'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <first> <second> [rest...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum array argument', async t => {
	const fixture = 'enum-argument/array';

	const valid = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(valid.stdout, 'Arguments = Ubuntu, Debian');

	await t.throwsAsync(() => run(fixture), {
		message: /error: missing required argument 'os'/,
	});

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] <os...>',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('optional enum array argument', async t => {
	const fixture = 'enum-argument/optional-array';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments =');

	const valid = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(valid.stdout, 'Arguments = Ubuntu, Debian');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [os...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});

test('enum array argument with default value', async t => {
	const fixture = 'enum-argument/array-default-value';

	const empty = await run(fixture);
	t.is(empty.stdout, 'Arguments = macOS, Windows');

	const valid = await run(fixture, ['Ubuntu', 'Debian']);
	t.is(valid.stdout, 'Arguments = Ubuntu, Debian');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [os...]',
			'',
			'Description',
			'',
			'Options:',
			`  -v, --version  Show version number`,
			`  -h, --help     Show help`,
		].join('\n'),
	);
});
