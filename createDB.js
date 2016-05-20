/**
 * Created by el on 08.05.16.
 */
var mongoose = require('lib/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {

    var users = [
        {email: 'admin@gruppa501.com', firstname: 'admin', password: 'admin', permissions:{admin: true}},
        {email: 'aryamnov@gruppa501.com', firstname: 'Евгений', lastname: 'Арямнов', password: 'EJsNhZwA'},
        {email: 'gorbunove@gruppa501.com', firstname: 'Андрей', lastname: 'Горбунов', password: 'gGFYMcLP'},
        {email: 'potemkin@gruppa501.com', firstname: 'Иван', lastname: 'Потемкин', password: 'cHgHktUa'},
        {email: 'timchur@gruppa501.com', firstname: 'Иван', lastname: 'Тимчур', password: 'qR8JnsbX'},
        {email: 'kurtaliev@gruppa501.com', firstname: 'Эльнур', lastname: 'Курталиев', password: 'test'},
        {email: 'egamnazarov@gruppa501.com', firstname: 'Алим', lastname: 'Эгамназаров', password: 'f3qbF3fL'},
        {email: 'jurchenko@gruppa501.com', firstname: 'Георгий', lastname: 'Юрченко', password: 'e5rZByP6'}
    ];

    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}