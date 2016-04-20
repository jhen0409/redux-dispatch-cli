# Remote Redux Dispatch CLI [![NPM version](http://img.shields.io/npm/v/redux-dispatch-cli.svg?style=flat)](https://www.npmjs.com/package/redux-dispatch-cli)

> A CLI tool for Redux remote dispatch. Used in [remote-redux-devtools](https://github.com/zalmoxisus/remote-redux-devtools)

## Screenshot

![Screenshot](https://cloud.githubusercontent.com/assets/3001525/14658566/56aaecc0-06c7-11e6-8f21-f3503c3faf24.gif)

## Installation

```bash
$ npm install -g redux-dispatch-cli
```

## Usage

Use `redux-dispatch` or `rrd` command.

```bash
# Connect to remotedev-server
$ redux-dispatch connect --hostname <hostname> --port <port>

# Show instance list
$ redux-dispatch ls-instance

# Select instance
$ redux-dispatch select <instance>

# Dispatch action
$ redux-dispatch action "{ type: 'ACTION', ... }"

# Start daemon (`connect` can also start daemon)
$ redux-dispatch start
# Restart daemon
$ redux-dispatch restart
# Stop daemon
$ redux-dispatch stop
# Check daemon status
$ redux-dispatch status
```

Run `redux-dispatch --help` or `redux-dispatch <command> --help` for more information.

## Steps

#### Connect to [remotedev-server](https://github.com/zalmoxisus/remotedev-server) (hostname default: `localhost`)

```bash
$ rrd connect --hostname <hostname> --port <port>
```

It will create a daemon, the daemon process will exit when `$HOME/.remotedev_d_port` is removed.

#### Show available instance List

```bash
$ rrd ls-instance
```

Make sure have instance can dispatch action, wait your application start (restart). 

#### Select a instance (default: `auto`)

```bash
$ rrd select <instanceKey>
```

#### Dispatch action

```bash
$ rrd action "{ type: 'ACTION', a: 1 }"
```

## TODOs

- [ ] [Enable sync](https://github.com/zalmoxisus/remotedev-app/blob/master/src/app/store/createRemoteStore.js#L28) command

## Credits

* Remote store create from [zalmoxisus/remotedev-app](https://github.com/zalmoxisus/remotedev-app)
* Daemon inspired by [mantoni/eslint_d.js](https://github.com/mantoni/eslint_d.js)
* Used [chentsulin/react-native-counter-ios-android](https://github.com/chentsulin/react-native-counter-ios-android) as a example of screenshot

## License

[MIT](LICENSE.md)
