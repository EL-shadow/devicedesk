var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('unlock', {
        title: 'DeviceDesk | Вернуть устройство',
        menu: 'unlock'
    });
});

module.exports = router;