/**
 * Created by el on 10.05.16.
 */
//var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        req.session.destroy();
        return res.redirect('/login');
        //return next(new HttpError(401, "Вы не авторизованы"));
    }
    next();
};