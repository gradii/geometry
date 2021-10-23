fedaco-cli
==========

fedaco orm cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fedaco-cli.svg)](https://npmjs.org/package/fedaco-cli)
[![Downloads/week](https://img.shields.io/npm/dw/fedaco-cli.svg)](https://npmjs.org/package/fedaco-cli)
[![License](https://img.shields.io/npm/l/fedaco-cli.svg)](https://github.com/LinPoLen/fedaco-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fedaco-cli
$ fedaco-cli COMMAND
running command...
$ fedaco-cli (-v|--version|version)
fedaco-cli/0.0.0 darwin-x64 node-v12.22.6
$ fedaco-cli --help [COMMAND]
USAGE
  $ fedaco-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fedaco-cli hello [FILE]`](#fedaco-cli-hello-file)
* [`fedaco-cli help [COMMAND]`](#fedaco-cli-help-command)

## `fedaco-cli hello [FILE]`

describe the command here

```
USAGE
  $ fedaco-cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ fedaco-cli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/LinPoLen/fedaco-cli/blob/v0.0.0/src/commands/hello.ts)_

## `fedaco-cli help [COMMAND]`

display help for fedaco-cli

```
USAGE
  $ fedaco-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
