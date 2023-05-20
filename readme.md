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
	name: zod.string().desc('Your name'),
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

### Types

#### String

#### Number

#### Boolean

#### Enum

#### Array

#### Enum

### Optional or required options

### Default value

### Alias

###

## Arguments

### Types

#### String

#### Number

#### Enum

### Optional or required arguments

### Default value

### Variadic arguments

## Custom app
