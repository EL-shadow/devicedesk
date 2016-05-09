var express = require('express');
var router = express.Router();
var User = require('models/user').User;

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Админка',
        menu: 'index'
    });
});

router.get('/users', function (req, res, next) {
    User.find({ }, { firstname: 1, lastname: 1, email: 1 }, function(err, users) {
        if (err) return next(err);
        res.render('admin/users', {
            title: 'DeviceDesk - Пользователи',
            menu: 'users',
            userList: users
        });
    })
});

router.delete('/user/:id', function (req, res, next) {
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
