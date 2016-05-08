var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Админка',
        menu: 'index'
    });
});

module.exports = router;