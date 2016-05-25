var express = require('express');
var router = express.Router();
var async = require('async');
var User = require('models/user').User;
var Device = require('models/device').Device;
var useAction = require('models/useAction').useAction;

var checkAuth = require('middleware/checkAuth');

router.get('/', checkAuth, function (req, res, next) {
    async.waterfall([
        function(callback) {
            Device.count({}, function (err, count) {
                if (err) return callback(err);
                callback(null, {all: count});
            });
        },
        function (data, callback) {
            Device.count({'inUse.start': null}, function (err, count) {
                if (err) return callback(err);
                data.unlocked = count;
                data.locked = data.all - count;
                callback(null, data);
            });
        },
        function (data, callback) {
            Device.count({'inUse.user': req.user._id}, function (err, count) {
                if (err) return callback(err);
                data.byMe = count;
                callback(null, data);
            });
        },
        function (data, callback) {
            res.render('index', {
                title: 'DeviceDesk - Система контроля доступа к устройствам | Dashboard',
                menu: 'index',
                info: data
            });
        }
    ], next);
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Вход'
    });
});

router.post('/login', require('./login'));

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/lock', checkAuth, function (req, res, next) {
    res.render('lock', {
        title: 'DeviceDesk | Занять устройство',
        menu: 'lock'
    });
});

router.post('/lock', checkAuth, function (req, res, next) {
    var deviceCode = req.body.deviceCode;
    var user = req.user;
    Device.lock(deviceCode,user,function (err, device) {
        if (err) {
            if (err.message === 'Устройство уже занято.') {
                return res.status(423).send(device.model + ' - ' +err.message);
            } else {
                return res.status(404).send(err.message);
            }
        }
        var take = new useAction({
            take: true,
            deviceId: device._id,
            userId: device.inUse.user,
            created: device.inUse.start
        });
        take.save(function (err) {
            if (err) {return next(err);}

            return res.send(device.model);
        });
    });
});

router.get('/unlock', checkAuth, function (req, res, next) {
    res.render('unlock', {
        title: 'DeviceDesk | Вернуть устройство',
        menu: 'unlock'
    });
});

router.post('/unlock', checkAuth, function (req, res, next) {
    var deviceCode = req.body.deviceCode;
    var user = req.user;
    Device.unlock(deviceCode, function (err, device) {
        if (err) {
            if (err.message === 'Устройство уже сдано.') {
                return res.status(423).send(device.model + ' - ' +err.message);
            } else {
                return res.status(404).send(err.message);
            }
        }
        var returnAction = new useAction({
            take: false,
            deviceId: device._id,
            userId: user._id,
            created: Date.now()
        });
        returnAction.save(function (err) {
            if (err) {return next(err);}

            return res.send(device.model);
        });
    });
});


router.get('/find', checkAuth, function (req, res, next) {
    Device.find({'inUse.start': {$ne: null}}, function (err, devices) {
        if (err) return next(err);

        res.render('find', {
            title: 'DeviceDesk | Найти устройство',
            menu: 'find',
            devices: devices
        });
    });
    
});

router.post('/find', checkAuth, function (req, res, next) {
    var id = req.body.deviceId;

    async.waterfall([
        function(callback) {
            Device.findById(id, function (err, device) {
                if (err) return next(err);
                callback(null, device)
            });
        },
        function (device, callback) {
            if (device && device.inUse.user) {
                User.findById(device.inUse.user, function (err, user) {
                    if (err) return next(err);
                    callback(null, {device: device, user: user});
                });
            } else {
                callback(null, {device: device});
            }
        },
        function (data, callback) {
            var result = {
                device: {
                    type: data.device.deviceType,
                    model: data.device.model,
                    name: data.device.name,
                    leaseTime: data.device.inUse.start
            }};
            if (data.user) {
                result.user = {
                    firstname: data.user.firstname,
                    lastname: data.user.lastname,
                    email: data.user.email
                };
            }
            res.send(result);
        }
    ], next);
});

module.exports = router;
