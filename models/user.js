/**
 * Created by el on 07.05.16.
 */
var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String
    },
    permissions: {
        admin: {
            type: String,
            default: null
        },
        deviceAccess: {
            all: {
                type: Boolean,
                default: true
            },
            list: [Schema.Types.ObjectId]
        }
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(email, password, accessAdmin, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({email: email}, callback);
        },
        function (user, callback) {
            if (user && user.checkPassword(password)) {
                if (accessAdmin && !user.permissions.admin) {
                    return callback(new AuthError("Access Denied - Нет полномочий для входа"));
                }
                callback(null, user);
            } else {
                callback(new AuthError("Логин или Пароль неверен"));
            }
        }
    ], callback);
};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;