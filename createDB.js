/**
 * Created by el on 08.05.16.
 */
var mongoose = require('lib/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createDevices
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
    require('models/device');

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
function createDevices(callback) {

    var devices = [
        {uniqId: 'IMEI 35686800-004141-1-20', deviceType: 'смартфон', model: 'Galaxy Note 3'},
        {uniqId: 'IMEI 35167301-326108-5-14', deviceType: 'смартфон', model: 'Galaxy Note II'},
        {uniqId: 'MAC 24DBAC13D2C7', deviceType: 'смартфон', model: 'Galaxy S III'},
        {uniqId: 'IMEI 023602027905017', deviceType: 'смартфон', model: 'Galaxy S5'},
        {uniqId: 'Serial F2MKG1B1DTWE', deviceType: 'планшет', model: 'Kindle Fire HDX'},
        {uniqId: 'Serial E0893VVPC06440K', deviceType: 'смартфон', model: 'LG Optimus L70'},
        {uniqId: 'Serial F7RLPE8DF199', deviceType: 'планшет', model: 'Nexus 10'},
        {uniqId: 'IMEI 013214006035960', deviceType: 'смартфон', model: 'Nexus 4'},
        {uniqId: 'Serial DMQHGMG5DKPH', deviceType: 'смартфон', model: 'Nexus 5'},
        {uniqId: 'IMEI 358240-05-414316-9', deviceType: 'смартфон', model: 'Nexus 6'},
        {uniqId: 'Serial 311KPJP414316', deviceType: 'планшет', model: 'Nexus 7'},
        {uniqId: 'Serial N8U4CA9231602244', deviceType: 'смартфон', model: 'Nexus 6P'},
        {uniqId: 'Serial 354172020643853', deviceType: 'смартфон', model: 'Nokia Lumia 520'},
        {uniqId: 'IMEI 356059032003051', deviceType: 'смартфон', model: 'Nokia N9'},
        {uniqId: 'MAC 00266981A071', deviceType: 'планшет', model: 'iPad 2', name: 'черный iPad 2'},
        {uniqId: 'Serial ZA8N3S5CB00237D', deviceType: 'планшет', model: 'iPad 2', name: 'белый iPad2'},
        {uniqId: 'IMEI 353261000749664', deviceType: 'планшет', model: 'iPad Air 2'},
        {uniqId: 'IMEI 354203038117729', deviceType: 'планшет', model: 'iPad Pro'},
        {uniqId: 'IMEI 355868052283406', deviceType: 'планшет', model: 'iPad Mini 4'},
        {uniqId: 'Serial DLXHD504DVD3', deviceType: 'смартфон', model: 'iPhone 4'},
        {uniqId: 'Serial J7P3D7P3DTD0', deviceType: 'смартфон', model: 'iPhone 5s'},
        {uniqId: 'MAC D023DBA6D637', deviceType: 'смартфон', model: 'iPhone 6'},
        {uniqId: 'IMEI 012938002938000', deviceType: 'смартфон', model: 'iPhone 6 Plus'},
        {uniqId: 'IMEI 013039003900060', deviceType: 'смартфон', model: 'iPhone 6s'},
        {deviceType: 'кабель', model: 'usb-ligtning (iPhone)'},
        {deviceType: 'кабель', model: 'usb-iPad'},
        {deviceType: 'зарядка', model: 'Samsung', name: '2A, белая'},
        {deviceType: 'зарядка', model: 'Nokia', name: 'тонкая'},
        {deviceType: 'кабель', model: 'usb-microUSB', name: 'черный LG'},
        {deviceType: 'Зарядка', name: 'USB универсальная'}
    ];

    async.each(devices, function(deviceData, callback) {
        var device = new mongoose.models.Device(deviceData);
        device.save(callback);
    }, callback);
}