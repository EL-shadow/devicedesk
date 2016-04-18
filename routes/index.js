var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'DeviceDesk - Система контроля доступа к устройствам | Dasboard',
        menu: 'index'
    });
});

module.exports = router;
