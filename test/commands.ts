import test from 'ava';
import run from './helpers/run';

test('single command', async t => {
	const fixture = 'single-command';

	const index = await run(fixture);
	t.is(index.stdout, 'Index');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options]',
			'',
			'Index command',
			'',
			'Options:',
			'  -v, --version  Show version number',
			'  -h, --help     Show help',
		].join('\n'),
	);
});

test('single default command', async t => {
	const fixture = 'single-default-command';

	const deploy = await run(fixture);
	t.is(deploy.stdout, 'Deploy');

	const help = await run(fixture, ['--help']);

	t.is(
		help.stdout,
		[
			'Usage: test [options] [command]',
			'',
			'Description',
			'',
			'Options:',
			'  -v, --version   Show version number',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  deploy          Deploy command',
			'  help [command]  Show help for command',
		].join('\n'),
	);
});

test('multiple commands', async t => {
	const fixture = 'multiple-commands';

	const index = await run(fixture);
	t.is(index.stdout, 'Deploy');

	const indexHelp = await run(fixture, ['--help']);

	t.is(
		indexHelp.stdout,
		[
			'Usage: test [options] [command]',
			'',
			'Description',
			'',
			'Options:',
			'  -v, --version   Show version number',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  auth            Auth command',
			'  deploy          Deploy command',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const deploy = await run(fixture, ['deploy']);
	t.is(deploy.stdout, 'Deploy');

	const deployHelp = await run(fixture, ['deploy', '--help']);

	t.is(
		deployHelp.stdout,
		[
			'Usage: test deploy [options]',
			'',
			'Deploy command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const auth = await run(fixture, ['auth']);
	t.is(auth.stdout, 'Auth');

	const authHelp = await run(fixture, ['auth', '--help']);

	t.is(
		authHelp.stdout,
		[
			'Usage: test auth [options]',
			'',
			'Auth command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);
});

test('nested commands', async t => {
	const fixture = 'nested-commands';

	const index = await run(fixture);
	t.is(index.stdout, 'Deploy');

	const indexHelp = await run(fixture, ['--help']);

	t.is(
		indexHelp.stdout,
		[
			'Usage: test [options] [command]',
			'',
			'Description',
			'',
			'Options:',
			'  -v, --version   Show version number',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  auth            Auth command',
			'  deploy          Deploy command',
			'  servers         Manage servers',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const auth = await run(fixture, ['auth']);
	t.is(auth.stdout, 'Auth');

	const authHelp = await run(fixture, ['auth', '--help']);

	t.is(
		authHelp.stdout,
		[
			'Usage: test auth [options]',
			'',
			'Auth command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const servers = await run(fixture, ['servers'], {
		reject: false,
	});

	t.is(
		servers.stderr,
		[
			'Usage: test servers [options] [command]',
			'',
			'Manage servers',
			'',
			'Options:',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  create          Create server',
			'  list            List servers',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const createServer = await run(fixture, ['servers', 'create']);
	t.is(createServer.stdout, 'Create server');

	const createServerHelp = await run(fixture, ['servers', 'create', '--help']);

	t.is(
		createServerHelp.stdout,
		[
			'Usage: test servers create [options]',
			'',
			'Create server',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const listServers = await run(fixture, ['servers', 'list']);
	t.is(listServers.stdout, 'List servers');

	const listServersHelp = await run(fixture, ['servers', 'list', '--help']);

	t.is(
		listServersHelp.stdout,
		[
			'Usage: test servers list [options]',
			'',
			'List servers',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);
});

test('deeply nested commands', async t => {
	const fixture = 'deeply-nested-commands';

	const index = await run(fixture);
	t.is(index.stdout, 'Deploy');

	const indexHelp = await run(fixture, ['--help']);

	t.is(
		indexHelp.stdout,
		[
			'Usage: test [options] [command]',
			'',
			'Description',
			'',
			'Options:',
			'  -v, --version   Show version number',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  auth            Auth command',
			'  deploy          Deploy command',
			'  projects        Manage projects',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const auth = await run(fixture, ['auth']);
	t.is(auth.stdout, 'Auth');

	const authHelp = await run(fixture, ['auth', '--help']);

	t.is(
		authHelp.stdout,
		[
			'Usage: test auth [options]',
			'',
			'Auth command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const projects = await run(fixture, ['projects'], {
		reject: false,
	});

	t.is(
		projects.stderr,
		[
			'Usage: test projects [options] [command]',
			'',
			'Manage projects',
			'',
			'Options:',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  create          Create project',
			'  list            List projects',
			'  servers         Manage servers',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const createProject = await run(fixture, ['projects', 'create']);
	t.is(createProject.stdout, 'Create project');

	const createProjectHelp = await run(fixture, [
		'projects',
		'create',
		'--help',
	]);

	t.is(
		createProjectHelp.stdout,
		[
			'Usage: test projects create [options]',
			'',
			'Create project',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const listProjects = await run(fixture, ['projects', 'list']);
	t.is(listProjects.stdout, 'List projects');

	const listProjectsHelp = await run(fixture, ['projects', 'list', '--help']);

	t.is(
		listProjectsHelp.stdout,
		[
			'Usage: test projects list [options]',
			'',
			'List projects',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const servers = await run(fixture, ['projects', 'servers'], {
		reject: false,
	});

	t.is(
		servers.stderr,
		[
			'Usage: test projects servers [options] [command]',
			'',
			'Manage servers',
			'',
			'Options:',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  create          Create server',
			'  list            List servers',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const createServer = await run(fixture, ['projects', 'servers', 'create']);
	t.is(createServer.stdout, 'Create server');

	const createServerHelp = await run(fixture, [
		'projects',
		'servers',
		'create',
		'--help',
	]);

	t.is(
		createServerHelp.stdout,
		[
			'Usage: test projects servers create [options]',
			'',
			'Create server',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const listServers = await run(fixture, ['projects', 'servers', 'list']);
	t.is(listServers.stdout, 'List servers');

	const listServersHelp = await run(fixture, [
		'projects',
		'servers',
		'list',
		'--help',
	]);

	t.is(
		listServersHelp.stdout,
		[
			'Usage: test projects servers list [options]',
			'',
			'List servers',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);
});

test('snake case command name', async t => {
	const fixture = 'camelcase-command';

	const index = await run(fixture);
	t.is(index.stdout, 'Deploy');

	const indexHelp = await run(fixture, ['--help']);

	t.is(
		indexHelp.stdout,
		[
			'Usage: test [options] [command]',
			'',
			'Description',
			'',
			'Options:',
			'  -v, --version   Show version number',
			'  -h, --help      Show help',
			'',
			'Commands:',
			'  auth            Auth command',
			'  super-deploy    Deploy command',
			'  help [command]  Show help for command',
		].join('\n'),
	);

	const deploy = await run(fixture, ['super-deploy']);
	t.is(deploy.stdout, 'Deploy');

	const deployHelp = await run(fixture, ['super-deploy', '--help']);

	t.is(
		deployHelp.stdout,
		[
			'Usage: test super-deploy [options]',
			'',
			'Deploy command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);

	const auth = await run(fixture, ['auth']);
	t.is(auth.stdout, 'Auth');

	const authHelp = await run(fixture, ['auth', '--help']);

	t.is(
		authHelp.stdout,
		[
			'Usage: test auth [options]',
			'',
			'Auth command',
			'',
			'Options:',
			'  -h, --help  Show help',
		].join('\n'),
	);
});
