#!/usr/bin/env node
'use strict';
const React = require('react'); // eslint-disable-line import/no-unresolved
const Ink = require('ink'); // eslint-disable-line import/no-unresolved
const boot = require('pasteljs/boot'); // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
const {commands} = require('./commands.json'); // eslint-disable-line import/no-unresolved

// This file is an entrypoint of CLI applications based on Pastel
// This file is copied to "build" directory of the CLI and "bin" field
// in package.json must point to it
boot(__dirname, React, Ink, commands);
