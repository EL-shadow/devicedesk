var express = require('express');
var router = express.Router();
var User = require('models/user').User;
var Device = require('models/device').Device;
var qr = require('qr-image');

var checkAuth = require('middleware/checkAuth');
var checkPermissions = require('middleware/checkPermissions');

router.get('/', checkAuth, checkPermissions, function (req, res, next) {
    res.render('admin/index', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Админка',
        menu: 'index'
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Вход'
    });
});


router.post('/login', require('../login'));

router.get('/users', checkAuth, checkPermissions, function (req, res, next) {
    User.find({ }, { firstname: 1, lastname: 1, email: 1 }, function(err, users) {
        if (err) return next(err);
        res.render('admin/users', {
            title: 'DeviceDesk - Пользователи',
            menu: 'users',
            userList: users
        });
    })
});

router.delete('/user/:id', checkAuth, checkPermissions, function (req, res, next) {
    User.find({ }, { firstname: 1, lastname: 1, email: 1 }, function(err, users) {
        if (err) return next(err);
        res.render('admin/users', {
            title: 'DeviceDesk - Пользователи',
            menu: 'users',
            userList: users
        });
    })
});


router.get('/devices', checkAuth, checkPermissions, function (req, res, next) {
    Device.find({ }, function(err, devices) {
        if (err) return next(err);
        res.render('admin/devices', {
            title: 'DeviceDesk - Устройства',
            menu: 'devices',
            deviceList: devices
        });
    })
});

router.get('/device/add', checkAuth, checkPermissions, function (req, res, next) {
    res.render('admin/device-add', {
        title: 'DeviceDesk - Добавление устройства',
        menu: 'devices',
        prev: false,
        message: false
    });
});
router.post('/device/add', checkAuth, checkPermissions, function (req, res, next) {
    var deviceData = {
        uniqId: req.body.uniqId,
        deviceType: req.body.deviceType,
        model: req.body.model,
        name: req.body.name
    };

    Device.find({uniqId: deviceData.uniqId}, function(err, devices) {
        if (err) return next(err);
        if (devices.length === 0) {
            var device = new Device(deviceData);
            device.save(function (err) {
                if (err) {return next(err);}
                return res.redirect('/admin/devices/');
            })
        } else {
            res.render('admin/device-add', {
                title: 'DeviceDesk - Добавление устройства',
                menu: 'devices',
                prev: deviceData,
                message: 'Ошибка: Введеный ID уже внесен в базу.'
            });
        }
    });
});

router.get('/device/:id/qr', checkAuth, checkPermissions, function (req, res, next) {
    Device.findById(req.params.id, function(err, device) {
        if (err) return next(err);
        var qrSvg = qr.imageSync(device.uniqId, { type: 'svg', ec_level: 'H'});
        res.render('admin/device-qr', {
            title: 'DeviceDesk - Печать QR',
            qrList: [{
                uniqId: device.uniqId,
                svg: qrSvg
            }]
        });
    })
});

router.post('/devices/qr', checkAuth, checkPermissions, function (req, res, next) {
    var uniqIdList = req.body.devicesUniqId;
    var qrList = [];
    if (uniqIdList) {
        uniqIdList = uniqIdList.split(';');
        uniqIdList.forEach(function (id) {
            qrList.push({
                uniqId: id,
                svg: qr.imageSync(id, { type: 'svg', ec_level: 'H'})
            });
        });
    }
    res.render('admin/device-qr', {
        title: 'DeviceDesk - Печать QR',
        qrList: qrList
    });
});

router.delete('/device/:id', checkAuth, checkPermissions, function (req, res, next) {
    Device.findById(req.params.id, function(err, device) {
        if (err) return next(err);
        device.remove();
        return res.sendStatus(200);
    })
});

module.exports = router;
