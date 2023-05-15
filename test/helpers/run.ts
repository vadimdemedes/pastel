import {fileURLToPath} from 'node:url';
import {execaNode, ExecaChildProcess, Options} from 'execa';

export default async function run(
	fixture: string,
	args: string[] = [],
	options?: Options,
): Promise<ExecaChildProcess> {
	const cliPath = fileURLToPath(
		new URL(`../fixtures/${fixture}/cli.ts`, import.meta.url),
	);

	return execaNode(cliPath, args, {
		nodeOptions: ['--loader', 'ts-node/esm'],
		...options,
	});
}
