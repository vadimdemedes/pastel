import {fileURLToPath} from 'node:url';
import {execaNode, type ExecaChildProcess, type Options} from 'execa';

export default async function run(
	fixture: string,
	args: string[] = [],
	options?: Options,
): Promise<ExecaChildProcess> {
	const cliPath = fileURLToPath(
		new URL(`../fixtures/${fixture}/cli.ts`, import.meta.url),
	);

	return execaNode(cliPath, args, {
		env: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			NODE_OPTIONS:
				'--loader=ts-node/esm --experimental-specifier-resolution=node --no-warnings',
		},
		...options,
	});
}
