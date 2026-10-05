import process from 'node:process';
import Pastel from '../../../source/index.js';

const app = new Pastel({
	importMeta: import.meta,
	renderOptions: {
		stdout: process.stderr,
	},
});

await app.run();
