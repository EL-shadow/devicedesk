var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('lock', {
        title: 'DeviceDesk | Занять устройство',
        menu: 'lock'
    });
});

module.exports = router;
