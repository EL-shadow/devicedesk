/**
 * Created by el on 20.05.16.
 */
var User = require('models/user').User;
var AuthError = require('models/user').AuthError;

module.exports = function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var checkPermission = req.baseUrl === '/admin';

    User.authorize(email, password, checkPermission, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return res.render('login', {
                    title: 'DeviceDesk - Система контроля доступа к устройствам | Вход',
                    message: 'Ошибка: ' + err.message
                });
            } else {
                return next(err);
            }
        }
        req.session.user = user._id;
        return res.redirect(req.baseUrl || '/');
    });
};
