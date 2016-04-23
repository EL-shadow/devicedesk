var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Вход'
    });
});

module.exports = router;
