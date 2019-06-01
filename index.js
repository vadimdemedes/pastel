'use strict';
const EventEmitter = require('events');
const {promisify} = require('util');
const path = require('path');
const fs = require('fs');
const Bundler = require('parcel-bundler');
const makeDir = require('make-dir');
const watch = require('watch');
const del = require('del');
const readCommands = require('./lib/read-commands');
const getEntrypointPaths = require('./lib/get-entrypoint-paths');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chmod = promisify(fs.chmod);

class Pastel extends EventEmitter {
	constructor(appPath, {testMode} = {}) {
		super();

		this.appPath = appPath;
		this.commandsPath = path.join(appPath, 'commands');
		this.buildPath = path.join(appPath, 'build');
		this.cachePath = path.join(appPath, 'node_modules', '.cache', 'parcel');

		this.testMode = testMode;
	}

	async createBuildDir() {
		// `del` refuses to delete "build" directory when running Pastel's tests,
		// so we use `force` option to override this behavior in test mode
		await del(this.buildPath, {
			force: this.testMode
		});

		return makeDir(this.buildPath);
	}

	async scanCommands() {
		const commands = await readCommands(this.commandsPath, this.commandsPath);
		await writeFile(path.join(this.buildPath, 'commands.json'), JSON.stringify({commands}, null, '\t'));

		return commands;
	}

	async saveEntrypoint() {
		const entrypointSource = await readFile(path.join(__dirname, 'entry.js'));

		await writeFile(path.join(this.buildPath, 'cli.js'), entrypointSource);
		await chmod(path.join(this.buildPath, 'cli.js'), 0o777);
	}

	createBundler(paths, {watch}) {
		return new Bundler(paths, {
			outDir: path.join(this.buildPath, 'commands'),
			cacheDir: this.cachePath,
			target: 'node',
			watch,
			logLevel: 0,
			throwErrors: !watch
		});
	}

	async build() {
		await this.createBuildDir();
		await this.saveEntrypoint();
		const commands = await this.scanCommands();
		const bundler = this.createBundler(getEntrypointPaths(this.commandsPath, commands), {watch: false});

		return bundler.bundle();
	}

	async watch({onStart, onFinish, onError}) {
		// Track errors to ensure they're emitted only once
		const pastErrors = [];

		const handleError = error => {
			if (pastErrors.includes(error.stack)) {
				return;
			}

			pastErrors.push(error.stack);
			onError(error);
		};

		// There's a lot of callbacks here that are async functions, so to avoid
		// using .catch() all the time this helper function will do that for us
		// to ensure any errors in these callbacks are propagated via `onError`
		const handleAsyncErrors = fn => {
			return (...args) => {
				fn(...args).catch(handleError);
			};
		};

		await this.createBuildDir();
		await this.saveEntrypoint();

		let bundler;

		const rebuild = handleAsyncErrors(async () => {
			if (bundler) {
				bundler.removeAllListeners('buildStart');
				bundler.removeAllListeners('bundled');
				bundler.removeAllListeners('buildError');
				bundler.stop();
			}

			const commands = await this.scanCommands();

			bundler = this.createBundler(getEntrypointPaths(this.commandsPath, commands), {watch: true});
			bundler.on('buildStart', onStart);

			bundler.on('bundled', handleAsyncErrors(async () => {
				await this.scanCommands();
				onFinish();
			}));

			bundler.on('buildError', handleError);
			return bundler.bundle();
		});

		rebuild();

		watch.createMonitor(this.commandsPath, {
			ignoreDotFiles: true,
			ignoreUnreadableDir: true
		}, monitor => {
			monitor.on('created', rebuild);
			monitor.on('removed', rebuild);
		});
	}
}

module.exports = Pastel;
