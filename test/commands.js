import path from 'path';
import stripIndent from 'strip-indent';
import execa from 'execa';
import test from 'ava';
import del from 'del';

const build = async fixture => {
	const fixturePath = path.join(__dirname, 'fixtures', 'commands', fixture);
	await execa('node', [path.join(__dirname, '..', 'cli'), 'build', '--test-mode'], {
		cwd: fixturePath
	});

	// Install Pastel into a fixture folder
	await execa('npm', ['install', '../../../../', '--no-save', '--no-bin-links', '--no-package-lock'], {
		cwd: fixturePath
	});
};

const cli = async (fixture, args = []) => {
	const {stdout} = await execa('node', [path.join(__dirname, 'fixtures', 'commands', fixture, 'build', 'cli'), ...args], {
		cwd: path.join(__dirname, 'fixtures', 'commands', fixture)
	});

	return stdout;
};

const cleanup = () => {
	return del([
		path.join(__dirname, 'fixtures', 'commands', '*', 'build'),
		path.join(__dirname, 'fixtures', 'commands', '*', 'node_modules')
	]);
};

test.after.always(cleanup);

test('single command', async t => {
	await build('single-command');
	const output = await cli('single-command');

	t.is(output, 'Hello world');
});

test('multiple commands', async t => {
	await build('multi-command');
	const outputA = await cli('multi-command', ['a']);
	const outputB = await cli('multi-command', ['b']);

	t.is(outputA, 'Command A');
	t.is(outputB, 'Command B');
});

test('flags', async t => {
	await build('flags');
	const helpOutput = await cli('flags', ['--help']);

	t.is(helpOutput, stripIndent(`
		cli

		Flags command

		Options:
		  --help         Show help                                             [boolean]
		  --version      Show version number                                   [boolean]
		  --string-arg   String arg              [string] [required] [default: "string"]
		  --boolean-arg  Boolean arg                          [boolean] [default: false]
		  --number-arg   Number arg                                [number] [default: 0]
		  --array-arg    Array arg                  [array] [default: ["a","b",false,0]]
	`).trim());

	const fullOutput = await cli('flags', [
		'--string-arg',
		'hello',
		'--boolean-arg',
		'--number-arg',
		'1',
		'--array-arg',
		'a',
		'--array-arg',
		'b'
	]);

	t.is(fullOutput, stripIndent(`
		stringArg: hello
		booleanArg: true
		numberArg: 1
		arrayArg: ["a","b"]
	`).trim());

	const defaultOutput = await cli('flags');

	t.is(defaultOutput, stripIndent(`
		stringArg: string
		booleanArg: false
		numberArg: 0
		arrayArg: ["a","b",false,0]
	`).trim());
});

test('aliases', async t => {
	await build('aliases');
	const helpOutput = await cli('aliases', ['--help']);

	t.is(helpOutput, stripIndent(`
		cli

		Aliases command

		Options:
		  --help                Show help                                      [boolean]
		  --version             Show version number                            [boolean]
		  --stream, -s          Stream arg                                      [string]
		  --new-arg, --old-arg  New arg                                         [string]
	`).trim());

	const noAliasOutput = await cli('aliases', [
		'--stream',
		'yes',
		'--new-arg',
		'no'
	]);

	t.is(noAliasOutput, stripIndent(`
		stream: yes
		newArg: no
	`).trim());

	const aliasOutput = await cli('aliases', [
		'-s',
		'yes',
		'--old-arg',
		'no'
	]);

	t.is(aliasOutput, stripIndent(`
		stream: yes
		newArg: no
	`).trim());
});

test('positional args', async t => {
	await build('positional-args');
	const helpOutput = await cli('positional-args', ['--help']);

	t.is(helpOutput, stripIndent(`
		cli <message> <other-message>

		Positional args command

		Positionals:
		  message        Message                                                [string]
		  other-message  Other message                                          [string]

		Options:
		  --help     Show help                                                 [boolean]
		  --version  Show version number                                       [boolean]
	`).trim());

	const cmdOutput = await cli('positional-args', ['hello', 'world', 'something', 'else']);

	t.is(cmdOutput, stripIndent(`
		message: hello
		otherMessage: world
		inputArgs: ["something","else"]
	`).trim());
});

test('typescript', async t => {
	await build('typescript');
	const output = await cli('typescript');

	t.is(output, 'Hello world');
});
