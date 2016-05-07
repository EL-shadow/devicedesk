/**
 * Created by el on 07.05.16.
 */
var nconf = require('nconf'),
    path = require('path');
nconf.argv()
    .env()
    .file({ file: path.join(__dirname,'config.json') });

module.exports = nconf;