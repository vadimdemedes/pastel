import Pastel from '../../../source/index.js';

const app = new Pastel({
	name: 'test',
	importMeta: import.meta,
});

await app.run();
