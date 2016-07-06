/**
 * Created by el on 10.05.16.
 */
//var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.user || !req.user.permissions.admin) {
        req.session.destroy();
        return res.redirect('/admin/login');
    }
    if (req.user.permissions.demo && req.method !== 'GET') {
        if (req.originalUrl !== '/admin/devices/qr') {
            throw new Error('Demo mode: read only');
        }
    }
    next();
};