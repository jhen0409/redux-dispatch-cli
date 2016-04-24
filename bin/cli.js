#!/usr/bin/env node

var client = require('../lib/client')

function noArg(yargs) {
  return yargs
}

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('connect', 'Connect to remotedev-server', function(yargs) {
    return yargs
      .option('hostname', {
        alias: 'host',
        default: 'localhost'
      })
      .option('port', {
        alias: 'p',
        default: '8000'
      })
  }, function(argv) {
    client.connect({
      hostname: argv.host,
      port: argv.port
    }).then(log => console.log(log))
  })
  .command('ls-instance', 'Show instance list', noArg, function() {
    client.lsInstance().then(log => console.log(log))
  })
  .command('select', 'Select instance', noArg, function(argv) {
    client.select(argv._[1] || 'auto').then(log => console.log(log))
  })
  .command('action', 'Dispatch action', noArg, function(argv) {
    if (!argv._[1]) return
    const getAction = new Function('return ' + argv._[1])
    client.action(getAction()).then(log => console.log(log))
  })
  .command('start', 'Start daemon (`connect` can also start daemon)', noArg, function() {
    client.start().then(log => console.log(log))
  })
  .command('restart', 'Restart daemon', noArg, function() {
    client.restart().then(log => console.log(log))
  })
  .command('stop', 'Stop daemon', noArg, function() {
    client.stop().then(log => console.log(log))
  })
  .command('status', 'Check daemon status', noArg, function() {
    client.status().then(log => console.log(log))
  })
  .help('h')
  .alias('h', 'help')
  .detectLocale(false)
  .argv
