var forever = require('forever-monitor');

var child = new (forever.Monitor)('main.js', {
  max: 10,
  silent: true,
  args: [],
  cwd: '/var/www/api',
  minUptime: 2000,
  spinSleepTime: 1000,
  sourceDir: '/var/www/api',
  watch: true,
  append: true,
  logFile: '/var/log/nginx-api/info.log',
  outFile: '/var/log/nginx-api/output.log',
  errFile: '/var/log/nginx-api/error.log'
});


child.on('watch:restart', function(info) {
  child.times = 0;
  console.error('Restarting script because ' + info.file + ' changed');
});

child.on('restart', function() {
  console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
  console.error('Forever detected script exited with code ' + code);
});

child.start();

process.on('message', (data)=> {
  console.log('from child process!', JSON.stringify(data))
})
