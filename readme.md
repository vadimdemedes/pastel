[![](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

# Pastel [![test](https://github.com/vadimdemedes/pastel/actions/workflows/test.yml/badge.svg)](https://github.com/vadimdemedes/pastel/actions/workflows/test.yml)

> Next.js-like framework for CLIs made with [Ink](https://github.com/vadimdemedes/ink).

## Features

- Create files in `commands` folder to add commands.
- Create folders in `commands` to add subcommands.
- Define options and arguments via [Zod](https://zod.dev).
- Full type-safety of options and arguments thanks to Zod.
- Auto-generated help message for commands, options and arguments.
- Uses battle-tested [Commander](https://github.com/tj/commander.js) package under the hood.

## Install

```console
npm install pastel
```

## Geting started

<details><summary>Manual setup</summary>
<p>

1. Set up a new project.

```console
mkdir hello-world
cd hello-world
npm init --yes
```

2. Install Pastel and TypeScript.

```console
npm install pastel
npm install --save-dev typescript @sindresorhus/tsconfig
```

3. Create a `tsconfig.json` file to set up TypeScript.

```json
{
	"extends": "@sindresorhus/tsconfig",
	"compilerOptions": {
		"moduleResolution": "node16",
		"module": "node16",
		"outDir": "build",
		"sourceMap": true,
		"jsx": "react"
	},
	"include": ["source"]
}
```

4. Create a `source` folder for the source code.

```console
mkdir source
```

5. Create a `source/cli.ts` file with the following code, which will be CLI's entrypoint:

```js
#!/usr/bin/env node
import Pastel from 'pastel';

const app = new Pastel({
	importMeta: import.meta,
});

await app.run();
```

6. Create `source/commands` folder for defining CLI's commands.

```console
mkdir source/commands
```

7. Create an `source/commands/index.tsx` file for a default command, with the following code:

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	name: zod.string().describe('Your name'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}) {
	return <Text>Hello, {options.name}!</Text>;
}
```

8. Build your CLI.

```console
npx tsc
```

9. Set up an executable file.

9.1. Add `bin` field to `package.json`, which points to the compiled version of `source/cli.ts` file.

```diff
	"bin": "build/cli.js"
```

9.2. Make your CLI available globally.

```console
npm link --global
```

10. Run your CLI.

```console
hello-world --name=Jane
```

```
Hello, Jane!
```

```console
hello-world --help
```

```
Usage: hello-world [options]

Options:
  --name         Your name
  -v, --version  Show version number
  -h, --help     Show help

```

</p></details>

## Table of contents

- [Commands](#commands)
  - [Index commands](#index-commands)
  - [Default commands](#default-commands)
  - [Subcommands](#subcommands)
  - [Aliases](#aliases)
- [Options](#options)
  - [Types](#types)
    - [String](#string)
    - [Number](#number)
    - [Boolean](#boolean)
    - [Enum](#enum)
    - [Array](#array)
    - [Set](#set)
  - [Optional or required options](#optional-or-required-options)
  - [Default value](#default-value)
  - [Alias](#alias)
- [Arguments](#arguments)
  - [Types](#types-1)
    - [String](#string-1)
    - [Number](#number-1)
    - [Enum](#enum-1)
- [Custom app](#custom-app)

## Commands

Pastel treats every file in the `commands` folder as a command, where filename is a command's name (excluding the extension). Files are expected to export a React component, which will be rendered when command is executed.

You can also nest files in folders to create subcommands.

Here's an example, which defines `login` and `logout` commands:

```
commands/
	login.tsx
	logout.tsx
```

**login.tsx**

```tsx
import React from 'react';
import {Text} from 'ink';

export default function Login() {
	return <Text>Logging in</Text>;
}
```

**logout.tsx**

```tsx
import React from 'react';
import {Text} from 'ink';

export default function Logout() {
	return <Text>Logging out</Text>;
}
```

Given that your executable is named `my-cli`, you can execute these commands like so:

```
$ my-cli login
$ my-cli logout
```

### Index commands

Files named `index.tsx` are index commands. They will be executed by default, when no other command isn't specified.

```
commands/
	index.tsx
	login.tsx
	logout.tsx
```

Running `my-cli` without a command name will execute `index.tsx` command.

```
$ my-cli
```

Index command is useful when you're building a single-purpose CLI, which has only one command. For example, [`np`](https://github.com/sindresorhus/np) or [fast-cli](https://github.com/sindresorhus/fast-cli).

### Default commands

Default commands are similar to index commands, because they too will be executed when an explicit command isn't specified. The difference is default commands still have a name, just like any other command, and they'll show up in the help message.

Default commands are useful for creating shortcuts to commands that are used most often.

Let's say there are 3 commands available: `deploy`, `login` and `logout`.

```
commands/
	deploy.tsx
	login.tsx
	logout.tsx
```

Each of them can be executed by typing their name.

```
$ my-cli deploy
$ my-cli login
$ my-cli logout
```

Chances are, `deploy` command is going to be used a lot more frequently than `login` and `logout`, so it makes sense to make `deploy` a default command in this CLI.

Export a variable named `isDefault` from the command file and set it to `true` to mark that command as a default one.

```diff
import React from 'react';
import {Text} from 'ink';

+ export const isDefault = true;

export default function Deploy() {
	return <Text>Deploying...</Text>;
}
```

Now, running `my-cli` or `my-cli deploy` will execute a `deploy` command.

```
$ my-cli
```

[Vercel's CLI](https://github.com/vercel/vercel/tree/main/packages/cli) is a real-world example of this approach, where both `vercel` and `vercel deploy` trigger a new deploy of your project.

### Subcommands

As your CLI grows and more commands are added, it makes sense to group the related commands together.

To do that, create nested folders in `commands` folder and put the relevant commands inside to create subcommands. Here's an example for a CLI that triggers deploys and manages domains for your project:

```
commands/
	deploy.tsx
	login.tsx
	logout.tsx
	domains/
		list.tsx
		add.tsx
		remove.tsx
```

Commands for managing domains would be executed like so:

```
$ my-cli domains list
$ my-cli domains add
$ my-cli domains remove
```

Subcommands can even be deeply nested within many folders.

### Aliases

Commands can have an alias, which is usually a shorter alternative name for the same command. Power users prefer aliases instead of full names for commands they use often. For example, most users type `npm i` instead of `npm install`.

Any command in Pastel can assign an alias by exporting a variable named `alias`:

```diff
import React from 'react';
import {Text} from 'ink';

+ export const alias = 'i';

export default function Install() {
	return <Text>Installing something...</Text>;
}
```

Now the same `install` command can be executed by only typing `i`:

```
$ my-cli i
```

## Options

Commands can define options to customize their default behavior or ask for some additional data to run properly.
For example, a command that creates a new server might specify options for choosing a server's name, an operating system, memory size or a region where that server should be spin up.

Pastel uses [Zod](https://zod.dev) to define, parse and validate command options. Export a variable named `options` and set a Zod [object schema](https://zod.dev/?id=objects). Pastel will parse that schema and automatically set these options up. When command is executed, option values are passed via `options` prop to your component.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	name: zod.string().describe('Server name'),
	os: zod.enum(['Ubuntu', 'Debian']).describe('Operating system'),
	memory: zod.number().describe('Memory size'),
	region: zod.enum(['waw', 'lhr', 'nyc']).describe('Region'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Deploy({options}) {
	return (
		<Text>
			Deploying a server named "{options.name}" running {options.os} with memory
			size of {options.memory} MB in {options.region} region
		</Text>
	);
}
```

With options set up, here's an example `deploy` command:

```
$ my-cli deploy --name=Test --os=Ubuntu --memory=1024 --region=waw
Deploying a server named "Test" running Ubuntu with memory size of 1024 MB in waw region.
```

Help message is auto-generated for you as well.

```
$ my-cli deploy --help
Usage: my-cli deploy [options]

Options:
  --name         Server name
  --os           Operating system (choices: "Ubuntu", "Debian")
  --memory       Memory size
  --region       Region
  -v, --version  Show version number
  -h, --help     Show help
```

### Types

Pastel only supports [string](https://zod.dev/?id=strings), [number](https://zod.dev/?id=numbers), [boolean](https://zod.dev/?id=booleans), [enum](https://zod.dev/?id=zod-enums), [array](https://zod.dev/?id=arrays) and [set](https://zod.dev/?id=sets) types for defining options.

#### String

Example that defines a `--name` string option:

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	name: zod.string().describe('Your name'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Name = {options.name}</Text>;
}
```

```
$ my-cli --name=Jane
Name = Jane
```

#### Number

Example that defines a `--size` number option:

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	age: zod.number().describe('Your age'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Age = {options.age}</Text>;
}
```

```
$ my-cli --age=28
Age = 28
```

#### Boolean

Example that defines a `--compress` number option:

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	compress: zod.boolean().describe('Compress output'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Compress = {String(options.compress)}</Text>;
}
```

```
$ my-cli --compress
Compress = true
```

Boolean options are special, because they can't be required and default to `false`, even if Zod schema doesn't use a `default(false)` function.

When boolean option defaults to `true`, it's treated as a negated option, which adds a `no-` prefix to its name.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	compress: zod.boolean().default(true).describe("Don't compress output"),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Compress = {String(options.compress)}</Text>;
}
```

```
$ my-cli --no-compress
Compress = false
```

#### Enum

Example that defines an `--os` enum option with a set of allowed values.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	os: zod.enum(['Ubuntu', 'Debian']).describe('Operating system'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Operating system = {options.os}</Text>;
}
```

```
$ my-cli --os=Ubuntu
Operating system = Ubuntu

$ my-cli --os=Debian
Operating system = Debian

$ my-cli --os=Windows
error: option '--os <os>' argument 'Windows' is invalid. Allowed choices are Ubuntu, Debian.
```

#### Array

Example that defines a `--tag` array option, which can be specified multiple times.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	tag: zod.array(zod.string()).describe('Tags'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Tags = {options.tags.join(', ')}</Text>;
}
```

```
$ my-cli --tag=App --tag=Production
Tags = App, Production
```

Array options can only include strings (`zod.string`), numbers (`zod.number`) or enums (`zod.enum`).

#### Set

Example that defines a `--tag` set option, which can be specified multiple times. It's similar to an array option, except duplicate values are removed, since the option's value is a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instance.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	tag: zod.set(zod.string()).describe('Tags'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Tags = {[...options.tags].join(', ')}</Text>;
}
```

```
$ my-cli --tag=App --tag=Production --tag=Production
Tags = App, Production
```

Set options can only include strings (`zod.string`), numbers (`zod.number`) or enums (`zod.enum`).

### Optional or required options

Pastel determines whether option is optional or required by parsing its Zod schema. Since Zod schemas are required by default, so are options in Pastel.

If an option isn't be required for a command to function properly, mark it as optional.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	os: zod.enum(['Ubuntu', 'Debian']).optional().describe('Operating system'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Operating system = {options.os ?? 'unspecified'}</Text>;
}
```

```
$ my-cli --os=Ubuntu
Operating system = Ubuntu

$ my-cli
Operating system = unspecified
```

### Default value

Default value for an option can be set via a `default` function in Zod schema.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';

export const options = zod.object({
	os: zod
		.enum(['Ubuntu', 'Debian'])
		.default('Ubuntu')
		.describe('Operating system'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Operating system = {options.os}</Text>;
}
```

```
$ my-cli
Operating system = Ubuntu
```

### Alias

Options can specify an alias, which is usually the first letter of an original option name.

```tsx
import React from 'react';
import {Text} from 'ink';
import {z as zod} from 'zod';
import {option} from 'pastel';

export const options = zod.object({
	force: zod.boolean().describe(
		option({
			description: 'Force',
			alias: 'f',
		}),
	),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Example({options}) {
	return <Text>Force = {String(options.force)}</Text>;
}
```

```
$ my-cli --force
Force = true

$ my-cli -f
Force = true
```

## Arguments

Arguments are similar to options, except they don't require a flag to specify them (e.g. `--name`) and they're always specified after command name and options. For example, [`mv`](https://linux.die.net/man/1/mv) requires 2 arguments, where first argument is a source path and second argument is a target path.

```
$ mv source.txt target.txt
```

A theoretical `mv` command in Pastel can define similar arguments like so:

```tsx
import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.tuple([zod.string(), zod.string()]);

type Props = {
	args: zod.infer<typeof arguments>;
};

export default function Move({args}: Props) {
	return (
		<Text>
			Moving from {args[0]} to {args[1]}
		</Text>
	);
}
```

```
$ my-cli source.txt target.txt
Moving from source.txt to target.txt
```

This command defines two positional arguments, which means that argument's position matters for command's execution. This is why positional arguments are defined via [zod.tuple](https://zod.dev/?id=tuples) in Zod, where a specific number of values is expected.

However, there are commands like [`rm`](https://linux.die.net/man/1/rm), which can accept any number of arguments. To accomplish that in Pastel, use [`zod.array`](https://zod.dev/?id=arrays) instead.

```tsx
import React from 'react';
import {Text} from 'ink';
import zod from 'zod';

export const args = zod.array(zod.string());

type Props = {
	args: zod.infer<typeof arguments>;
};

export default function Remove({args}: Props) {
	return <Text>Removing {args.join(', ')}</Text>;
}
```

```
$ my-cli a.txt b.txt c.txt
Removing a.txt, b.txt, c.txt
```

### Types

Pastel only supports [string](https://zod.dev/?id=strings), [number](https://zod.dev/?id=numbers) and [enum](https://zod.dev/?id=zod-enums) types for defining arguments inside [tuple](https://zod.dev/?id=tuples) or [array](https://zod.dev/?id=arrays).

#### String

Example that defines a string argument.

```tsx
import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from 'pastel';

export const args = zod.tuple([
	zod.string().describe(
		argument({
			name: 'name',
			description: 'Your name',
		}),
	),
]);

type Props = {
	args: zod.infer<typeof arguments>;
};

export default function Hello({args}: Props) {
	return <Text>Hello, {args[0]}</Text>;
}
```

```
$ my-cli Jane
Hello, Jane
```

#### Number

Example that defines a number argument.

```tsx
import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from 'pastel';

export const args = zod.tuple([
	zod.number().describe(
		argument({
			name: 'age',
			description: 'Age',
		}),
	),
]);

type Props = {
	args: zod.infer<typeof arguments>;
};

export default function Hello({args}: Props) {
	return <Text>Your age is {args[0]}</Text>;
}
```

```
$ my-cli 28
Your age is 28
```

#### Enum

Example that defines an enum argument.

```tsx
import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {argument} from 'pastel';

export const args = zod.tuple([
	zod.enum(['Ubuntu', 'Debian']).describe(
		argument({
			name: 'os',
			description: 'Operating system',
		}),
	),
]);

type Props = {
	args: zod.infer<typeof arguments>;
};

export default function Example({args}: Props) {
	return <Text>Operating system = {args[0]}</Text>;
}
```

```
$ my-cli Ubuntu
Operating system = Ubuntu
```

## Custom app

Similar to Next.js, Pastel wraps every command component with a component exported from `commands/_app.tsx`. If this file doesn't exist, Pastel uses a default app component, which does nothing but render your component with `options` and `args` props.

```tsx
import React from 'react';
import type {AppProps} from 'pastel';

export default function App({Component, commandProps}: AppProps) {
	return <Component {...commandProps} />;
}
```

You can copy paste that code into `commands/_app.tsx` and add some logic that will be shared across all commands.
