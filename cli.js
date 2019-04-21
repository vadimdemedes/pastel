#!/usr/bin/env node
'use strict';
const meow = require('meow');
const pastel = require('.');

const cli = meow(`
	Usage
	  $ pastel [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ pastel
	  unicorns & rainbows
	  $ pastel ponies
	  ponies & rainbows
`);

pastel.build(process.cwd(), { watch: Boolean(cli.flags.watch) })
	.then(() => {})
	.catch(error => {
		console.error(error)
	})
