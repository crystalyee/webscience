var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: '*', // use the glob format
    platforms: ['win', 'osx', 'linux'],
    version: '0.12.3'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
