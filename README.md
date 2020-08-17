<h1 align="center">
	<br>
	<br>
	<img width="300" alt="Pastel" src="media/logo.png">
	<br>
	<br>
	<br>
</h1>

# Pastel

> Framework for effortlessly building [Ink](https://github.com/vadimdemedes/ink) apps inspired by [Ronin](https://github.com/vadimdemedes/ronin) and ZEIT's [Next](https://github.com/zeit/next.js)

[![Build Status](https://travis-ci.org/vadimdemedes/pastel.svg?branch=master)](https://travis-ci.org/vadimdemedes/pastel)

- [Pastel](#pastel)
	- [Get Started](#get-started)
		- [Quick Setup](#quick-setup)
		- [Anatomy of a command](#anatomy-of-a-command)
	- [Developing your CLI tool](#developing-your-cli-tool)
		- [Applying Changes](#applying-changes)
		- [Adding Commands](#adding-commands)
		- [Typescript Support](#typescript-support)
	- [User Input](#user-input)
		- [Options](#options)
			- [Default values](#default-values)
			- [Short flags](#short-flags)
			- [Aliases](#aliases)
		- [Arguments](#arguments)
			- [Positional arguments](#positional-arguments)
		- [Conventions](#conventions)
			- [Naming](#naming)
			- [Descriptions](#descriptions)
	- [Distribution](#distribution)
	- [License](#license)

## Get Started

### Quick Setup

To get up and running with pastel, you simply run the following commands:

```bash
mkdir pasteltest
cd pasteltest
npx create-pastel-app
```

This will generate a new pastel project inside of your `pasteltest` directory. This project layout will look like this:

```bash
- build
  - commands
   - index.js
   - index.map.js
  - cli.js
  - commands.js
- commands
  - index.js
- package.json
- package-lock.json
- readme.md
```

Once generated, you'll have a new command that you can execute - `pasteltest`

If you run `pasteltest --help` you then you will get the following output

```bash
pasteltest

Hello world command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --name     Name of the person to greet                     [string] [required]
```

As you'll see, have a required parameter of `--name`. If we try to run `pasteltest` without providing this parameter we will receive the following:

```bash
pasteltest

Hello world command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --name     Name of the person to greet                     [string] [required]

Missing required argument: name
```

If we provide a name argument, like this -

```bash
pasteltest --name World
# or
pasteltest --name=World
```

we'll ge this output -

```bash
Hello, World
```

### Anatomy of a command

If you open up `commands/index.js` you'll find the following boilerplate code

```javascript
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

/// Hello world command
const Hello = ({ name }) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	/// Name of the person to greet
	name: PropTypes.string.isRequired,
};

export default Hello;
```

Here we are importing `React` as this is a React app, `React` is required to be in the scope, the same as typical web apps, then we're importing `PropTypes` which is used to define the arguments and their types, and lastly, we're importing the `Text` component from `ink`. This will allow us to render text.

Another point of interest here is the triple-slash (`/// Hello world command` and `/// Name of the person to greet`.) Let's run `pasteltest --help`

```bash
pasteltest

Hello world command <-------- Triple-slash on line 5

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --name     Name of the person to greet                     [string] [required] <-------- Triple-slash on line 9
```

We can use the `///` notation to add documentation to your commands and their arguments without needing to add additional properties or code to your command.

Lastly, your command must always export a React command for rendering that command.

```bash
export default Hello;
```

## Developing your CLI tool

### Applying Changes

After checking out the initial code for your new `pasteltest` CLI app, you'll probably want to start making some changes to your code. To do this, you'll need to run -

```bash
npm run dev
# or simply
pastel dev
```

This command will watch your `commands` directory for any changes and when you update your code, `pastel dev` will compile the code to the `build` directory.

For this to work properly you'll need to run the `dev` command in the background to watch for your changes, and then you'll be able to test any changes by running your command on the command line.

### Adding Commands

Each file in the `commands` folder is a command. For example, if you need a main (or index), `create` and `delete` commands, simply create `index.js`, `create.js` and `delete.js` files like that:

```
- commands/
  - index.js
  - create.js
  - delete.js
```

If you need nested commands, simply create sub-folders and put the files inside:

```
commands/
	- index.js
	- posts/
		- index.js
		- create.js
		- update.js
```

This will generate 4 commands:

- `pasteltest` (`index.js`)
- `pasteltest posts` (`posts/index.js`)
- `pasteltest posts create` (`posts/create.js`)
- `pasteltest posts update` (`posts/update.js`)

Just remember that each command must export a React command for rendering that command. For example:

```jsx
import React from "react";
import { Text } from "ink";

const HelloWorld = () => <Text>Hello World</Text>;

export default HelloWorld;
```

**Note:** For these changes to applying you'll need to have `npm run dev` running in the background.

### Typescript Support
Pastel has a certain amount of Typescript support. Simply change the extension of your command file and with the `.tsx` extension. A `tsconfig.json` will be generated for you.

If you want to define your own, make sure it contains the following:

```json
{
	"compilerOptions": {
		"jsx": "react"
	}
}
```

This will allow you to use Typescript inside of your application, however, if you were to rewrite the default `index.js` to `index.tsx` you could write it as -
```typescript
import React from 'react';
import {Text} from 'ink';

interface Props {
  name: string;
}

/// Hello world command
const Hello = (props: Props) => <Text>Hello, {props.name}</Text>;

export default Hello;
```

And this will work, however, if a name value is not provided, the application will return `Hello, ` so you will lose the internal error handling when values aren't provided. 

Also, running `pasteltest --help` will result in the following:
```bash
pasteltest

Hello world command

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```
As you can see there's no longer documentation provided for the `name` option. For this reason, we recommend sticking with `Prop Types` for handling user input.

## User Input

### Options

To accept options in your command, simply define the `propTypes` of your command's React component. Pastel scans each command and determines which `propTypes` are set and adds them to the list of accepted options of your command and to help message of your CLI (`--help`).

For example, here's how to accept a `name` option:

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

const Hello = ({ name }) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	name: PropTypes.string.isRequired,
};

export default Hello;
```

Assuming this is an `index.js` command and your CLI is named `hello`, you can execute this command like this:

```bash
$ hello --name=Millie
Hello, Millie
```

Beautiful, isn't it?

Pastel supports the following `propTypes`:

- `string`
- `bool`
- `number`
- `array`

#### Default values

There's no API for defining default values either.
Just set the desired default values in `defaultProps` property for each option and Pastel will take care of the rest.

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

const Hello = ({ name }) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	name: PropTypes.string,
};

Hello.defaultProps = {
	name: "Katy",
};

export default Hello;
```

```
$ hello
Hello, Katy
```

#### Short flags

Options can often beset with a shorter version of their name, using short flags.
The most popular example is the `--force` option. Most CLIs also accept `-f` as a shorter version of the same option.
To achieve the same functionality in Pastel, you can set `shortFlags` property and define short equivalents of option names:

```jsx
ImportantCommand.propTypes = {
	force: PropTypes.bool,
};

ImportantCommand.shortFlags = {
	force: "f",
};
```

Then you will be able to pass `-f` instead of `--force`:

```
$ important-command -f
```

#### Aliases

Aliases work the same way as short flags, but they have a different purpose.
Most likely you will need aliases to rename some option you want to deprecate.
For example, if your CLI previously accepted `--group`, but you've decided to rename it to `--team`, aliases will come handy:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const ListMembers = ({team}) => /* JSX */;

ListMembers.propTypes = {
	team: PropTypes.string.isRequired
};

ListMembers.aliases = {
	team: 'group'
};

export default ListMembers;
```

Both of these commands will produce the same output:

```bash
$ list-members --team=rockstars
$ list-members --group=rockstars
```

You can also set multiple aliases per option by passing an array:

```jsx
ListMembers.aliases = {
	team: ["group", "squad"],
};
```

### Arguments

First of all, let's clarify that arguments are different than options.
They're not prefixed with `--` or `-` and passed to your CLI like this:

```bash
$ my-beautiful-cli first second third
```

There can be any amount of such arguments, so we can't and shouldn't define a prop type for each of them.
Instead, Pastel reserves `inputArgs` prop to pass these arguments to your command:

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

const MyCli = ({ inputArgs }) => (
	<Text>
		First argument is "{inputArgs[0]}" and second is "{inputArgs[1]}"
	</Text>
);

MyCli.propTypes = {
	inputArgs: PropTypes.array,
};

export default MyCli;
```

If you run this command like this:

```bash
$ my-cli Jane Hopper
```

You will see the following output:

```
First argument is "Jane" and second is "Hopper"
```

#### Positional arguments

If you check out the example from the section above, you'll see that accessing arguments via index in `inputArgs` may not be convenient.
`inputArgs` works great for cases where you can't predict the number of arguments.
But if you do know that the user can pass 2 arguments, for example, then you can take advantage of positional arguments.
Positional arguments are specified the same way as regular arguments, only each of them can be assigned to a different prop.
So if you take a look at the example above, we know that the first argument is the first name and the second argument is last name.
Here's how to define that in Pastel:

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

const MyCli = ({ firstName, lastName }) => (
	<Text>
		First argument is "{firstName}" and second is "{lastName}"
	</Text>
);

MyCli.propTypes = {
	firstName: PropTypes.string,
	lastName: PropTypes.string,
};

MyCli.positionalArgs = ["firstName", "lastName"];

export default MyCli;
```

Nothing changes the way you execute this command:

```bash
$ my-cli Jane Hopper
First argument is "Jane" and second is "Hopper"
```

The order of the fields in `positionalArgs` will be respected. Optional arguments need to appear after the required ones.
If you want to collect an arbitrary amount of arguments you can define a variadic argument by giving it the array type.
Variadic arguments need to always be last and will capture all the remaining arguments.

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Text } from "ink";

const DownloadCommand = ({ urls }) => (
	<Text>Downloading {urls.length} urls</Text>
);

DownloadCommand.propTypes = {
	urls: PropTypes.array,
};

DownloadCommand.positionalArgs = ["urls"];

export default DownloadCommand;
```

```bash
$ my-cli download https://some/url https://some/other/url
Downloading 2 urls
```

Positional arguments also support aliases, but only one per argument. The rest will be ignored.

### Conventions

#### Naming

Options that are named with a single word (e.g. `name`, `force`, `verbose`) aren't modified in any way but there are cases where you need longer names like `--project-id` and variables that have dashes in their name aren't supported in JavaScript. Pastel has an elegant solution for this!
Just name your option `projectId` (camelCase) and Pastel will define it as `--project-id` option in your CLI.

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const ListMembers = ({projectId}) => /* JSX */;

ListMembers.propTypes = {
	projectId: PropTypes.string.isRequired
};

export default ListMembers;
```

```bash
$ list-members --project-id=abc
```

#### Descriptions

Pastel also offers a zero-API way of adding descriptions to your commands and options.
Simply add a comment that starts with 3 slashes (`///`) above the command or option you want to describe and Pastel will automatically parse it.
For example, here's how to add a description to your command:

```jsx
/// List all members in the project
const ListMembers = ({ projectId }) => <JSX />;
```

And here's how to document your options:

```jsx
ListMembers.propTypes = {
	/// ID of the project
	projectId: PropTypes.string,
};
```

When you run that command with a `--help` flag, here's the help message that will be generated:

```bash
$ list-members --help

List all members in the project

Options:

	--project-id  ID of the project          [string]
```

This also applies for flags, etc:
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

/// Hello world command
const Hello = (props) => <Text>Hello, {props.name}</Text>;

Hello.propTypes = {
	/// Forces the command to be executed
	force: PropTypes.bool,
};

Hello.shortFlags = {
	force: "f",
};

export default Hello;
```

Running `pasteltest --help` will output the following:
```bash
pasteltest

Hello world command

Options:
  --help       Show help                                               [boolean]
  --version    Show version number                                     [boolean]
  --force, -f  Forces the command to be executed                       [boolean]
```

## Distribution

Since Pastel compiles your application, the final source code of your CLI is generated in the `build` folder.
I recommend adding this folder to `.gitignore` to prevent committing it to your repository.
Also, to make sure you're shipping the latest and working version of the CLI when publishing your package on npm, add `prepare` script to `package.json`, which runs `pastel build`.

```json
{
	"scripts": {
		"prepare": "pastel build"
	}
}
```

This will always build your application before publishing.
Another important part is including `build` folder in the npm package by adding it to `files` field (if you're using it):

```json
{
	"files": ["build"]
}
```

And last but not least, the `bin` field.
This is the field which tells npm that your package contains a CLI and to ensure Pastel is working correctly, you must set it to `./build/cli.js`:

```json
{
	"bin": "./build/cli.js"
}
```

To sum up, here's the required fields together:

```json
{
	"name": "my-cli",
	"bin": "./build/cli.js",
	"scripts": {
		"prepare": "pastel build"
	},
	"files": ["build"]
}
```

## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes/pastel)
