import fs from 'node:fs/promises';
import path from 'node:path';
import {type ComponentType} from 'react';
import {type AppProps} from './types.js';

type AppExports = {
	default: ComponentType<AppProps>;
};

export default async function readCustomApp(
	directory: string,
): Promise<ComponentType<AppProps> | undefined> {
	const files = await fs.readdir(directory);
	let customApp: ComponentType<AppProps> | undefined;

	for (const file of files) {
		if (!/^_app\.(js|ts)x?$/.test(file)) {
			continue;
		}

		const filePath = path.join(directory, file);
		const m = (await import(filePath)) as AppExports;

		customApp = m.default;
		break;
	}

	return customApp;
}
