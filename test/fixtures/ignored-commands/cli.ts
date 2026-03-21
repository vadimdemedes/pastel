import Pastel from '../../../source/index.js';

const app = new Pastel({
	name: 'test',
	version: '0.0.0',
	description: 'Description',
	importMeta: import.meta,
	ignore: ['__tests__', '**/__tests__', '.dotfolder/'],
});

await app.run();
