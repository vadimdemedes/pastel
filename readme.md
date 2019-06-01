<h1 align="center">
	<br>
	<br>
	<img width="300" alt="Pastel" src="media/logo.png">
	<br>
	<br>
	<br>
</h1>

[![Build Status](https://travis-ci.org/vadimdemedes/pastel.svg?branch=master)](https://travis-ci.org/vadimdemedes/pastel)

> Framework for effortlessly building [Ink](https://github.com/vadimdemedes/ink) apps inspired by [Ronin](https://github.com/vadimdemedes/ronin) and ZEIT's [Next](https://github.com/zeit/next.js)


## Install

```bash
$ npm install pastel ink react prop-types
```


## Get Started

Pastel's API is a filesystem and React's `propTypes`.
Each file in `commands` folder is a separate command.
If you need to set up nested commands, you can create sub-folders and put these commands inside.

**Tip**: Want to skip the boring stuff and get straight to building a cool CLI? Use [create-pastel-app](https://github.com/vadimdemedes/create-pastel-app) to quickly scaffold out a Pastel app.

First, create a `package.json` with the following contents:

```json
{
	"name": "hello-person",
	"bin": "./build/cli.js",
	"scripts": {
		"build": "pastel build",
		"dev": "pastel dev",
		"prepare": "pastel build"
	}
}
```

After that, install Pastel and its dependencies:

```bash
$ npm install pastel ink react prop-types
```

Then create a `commands` folder:

```bash
$ mkdir commands
```

Then you can start creating commands in that folder. Let's create a main command, which has to be named `index.js` at `commands/index.js`:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

/// This is my command description
const HelloPerson = ({name}) => <Text>Hello, {name}</Text>;

HelloPerson.propTypes = {
	/// This is "name" option description
	name: PropTypes.string.isRequired
};

export default HelloPerson;
```

Note that React's `propTypes` are translated into options that are accepted by your CLI.

Finally, last step is to build your CLI:

```bash
$ npm run dev
```

This command will link your CLI, which will make `hello-person` (which is the name we picked in `package.json`) executable available globally.
It will also watch for any changes and rebuild your application.

Now is the time to test your CLI!

```bash
$ hello-person --name=Millie
Hello, Millie
```

Pastel also generates a help message automatically:

```bash
$ hello-person --help
hello-person

This is my command description

Options:

	--name  This is "name" option description       [boolean]
```

Did you notice that command and option descriptions are parsed from JavaScript comments as well? Neat!
If you found Pastel interesting, keep reading to see what else it can do!


## Documentation

- [Commands](#commands)
- [Options](#options)
	- [Naming](#naming)
	- [Descriptions](#descriptions)
	- [Default values](#default-values)
	- [Short flags](#short-flags)
	- [Aliases](#aliases)
- [Arguments](#arguments)
	- [Positional arguments](#positional-arguments)
- [Distribution](#distribution)

### Commands

Each file in `commands` folder is a command. For example, if you need a main (or index), `create` and `delete` commands, simply create `index.js`, `create.js` and `delete.js` files like that:

```
commands/
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

- `my-cli` (`index.js`)
- `my-cli posts` (`posts/index.js`)
- `my-cli posts create` (`posts/create.js`)
- `my-cli posts update` (`posts/update.js`)

Each command must export a React command for rendering that command. For example:

```jsx
import React from 'react';
import {Text} from 'ink';

const HelloWorld = () => <Text>Hello World</Text>;

export default HelloWorld;
```

### Options

To accept options in your command, simply define the `propTypes` of your command's React component.
Pastel scans each command and determines which `propTypes` are set.
Then it adds them to the list of accepted options of your command and to help message of your CLI (`--help`).

For example, here's how to accept a `name` option:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const Hello = ({name}) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	name: PropTypes.string.isRequired
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

#### Naming

Options that are named with a single word (e.g. `name`, `force`, `verbose`) aren't modified in any way.
However, there are cases where you need longer names like `--project-id` and variables that have dashes in their name aren't supported in JavaScript.
Pastel has an elegant solution for this!
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

Pastel also offers a zero-API way of adding description to your commands and options.
Simply add a comment that starts with 3 slashes (`///`) above the command or option you want to describe and Pastel will automatically parse it.
For example, here's how to add a description to your command:

```jsx
/// List all members in the project
const ListMembers = ({projectId}) => <JSX/>;
```

And here's how to document your options:

```jsx
ListMembers.propTypes = {
	/// ID of the project
	projectId: PropTypes.string
};
```

When you run that command with a `--help` flag, here's the help message that will be generated:

```bash
$ list-members --help

List all members in the project

Options:

	--project-id  ID of the project          [string]
```

#### Default values

There's no API for defining default values either.
Just set the desired default values in `defaultProps` property for each option and Pastel will take care of the rest.

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const Hello = ({name}) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	name: PropTypes.string
};

Hello.defaultProps = {
	name: 'Katy'
};

export default Hello;
```

```
$ hello
Hello, Katy
```

#### Short flags

Options can often be set with a shorter version of their name, using short flags.
Most popular example is `--force` option. Most CLIs also accept `-f` as a shorter version of the same option.
To achieve the same functionality in Pastel, you can set `shortFlags` property and define short equivalents of option names:

```jsx
ImportantCommand.propTypes = {
	force: PropTypes.bool
};

ImportantCommand.shortFlags = {
	force: 'f'
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
	team: ['group', 'squad']
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
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const MyCli = ({inputArgs}) => (
	<Text>
		First argument is "{inputArgs[0]}" and second is "{inputArgs[1]}"
	</Text>
);

MyCli.propTypes = {
	inputArgs: PropTypes.array
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
`inputArgs` works great for cases where you can't predict the amount of arguments.
But if you do know that user can pass 2 arguments, for example, then you can take advantage of positional arguments.
Positional arguments are specified the same way as regular arguments, only each of them can be assigned to a different prop.
So if you take a look at the example above, we know that first argument is the first name and second argument is last name.
Here's how to define that in Pastel:

```jsx
import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const MyCli = ({firstName, lastName}) => (
	<Text>
		First argument is "{firstName}" and second is "{lastName}"
	</Text>
);

MyCli.propTypes = {
	firstName: PropTypes.string,
	lastName: PropTypes.string
};

MyCli.positionalArgs = ['firstName', 'lastName'];

export default MyCli;
```

Nothing changes the way you execute this command:

```bash
$ my-cli Jane Hopper
First argument is "Jane" and second is "Hopper"
```

### Distribution

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
	"files": [
		"build"
	]
}
```

And last but not least, `bin` field.
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
	"files": [
		"build"
	]
}
```


## License

MIT © [Vadim Demedes](https://github.com/vadimdemedes/pastel)
