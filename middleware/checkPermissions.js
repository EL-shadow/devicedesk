/**
 * Created by el on 10.05.16.
 */
//var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.user || !req.user.permissions.admin) {
        req.session.destroy();
        return res.redirect('/admin/login');
    }
    next();
};