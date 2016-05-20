var express = require('express');
var router = express.Router();

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

router.get('/unlock', checkAuth, function (req, res, next) {
    res.render('unlock', {
        title: 'DeviceDesk | Вернуть устройство',
        menu: 'unlock'
    });
});

module.exports = router;
