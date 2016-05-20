var express = require('express');
var router = express.Router();
var User = require('models/user').User;

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

module.exports = router;
