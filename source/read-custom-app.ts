import fs from 'node:fs/promises';
import path from 'node:path';
import {ComponentType} from 'react';
import {AppProps} from './types.js';

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
		const m = await import(filePath);

		customApp = m.default;
		break;
	}

	return customApp;
}
