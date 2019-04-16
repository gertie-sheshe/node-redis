const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
    console.log('YEZZZUUUR');
    return exec.apply(this, arguments);
}