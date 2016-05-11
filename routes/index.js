var express = require('express');
var router = express.Router();
var User = require('models/user').User;
var AuthError = require('models/user').AuthError;
var HttpError = require('error').HttpError;

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

router.post('/login', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    User.authorize(email, password, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return res.render('login', {
                    title: 'DeviceDesk - Система контроля доступа к устройствам | Вход',
                    message: 'Ошибка: Логин или пароль неверен.'
                });
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        return res.redirect('/');
    });
});

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
