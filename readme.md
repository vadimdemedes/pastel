# pastel [![Build Status](https://travis-ci.org/vadimdemedes/pastel.svg?branch=master)](https://travis-ci.org/vadimdemedes/pastel)

> Framework for effortlessly building Ink apps


## Install

```
$ npm install pastel
```


## Usage

```js
const pastel = require('pastel');

pastel('unicorns');
//=> 'unicorns & rainbows'
```


## API

### pastel(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

Type: `Object`

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global pastel
```

```
$ pastel --help

  Usage
    pastel [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ pastel
    unicorns & rainbows
    $ pastel ponies
    ponies & rainbows
```


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes/pastel)
