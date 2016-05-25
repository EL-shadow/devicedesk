var express = require('express');
var router = express.Router();
var Device = require('models/device').Device;
var useAction = require('models/useAction').useAction;

var checkAuth = require('middleware/checkAuth');

router.get('/', checkAuth, function (req, res, next) {
    res.render('index', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Dashboard',
        menu: 'index'
    });
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

module.exports = router;
