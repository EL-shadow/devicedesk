/**
 * Created by el on 22.05.16.
 */
var async = require('async');
var util = require('util');

var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    uniqId: {
        type: String,
        unique: true,
        default: null
    },
    deviceType: {
        type: String,
        required: true
    },
    model: String,
    name: String,
    inUse: {
        user: {
            type: Schema.Types.ObjectId,
            default: null
        },
        start: {
            type: Date,
            default: null
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.post('validate', function(doc) {
    if (!doc.uniqId) {
        doc.uniqId = doc._id.toString();
    }
});

schema.statics.lock = function(uniqId, user, callback) {
    var Device = this;

    async.waterfall([
        function(callback) {
            Device.findOne({uniqId: uniqId}, callback);
        },
        function (device, callback) {
            if (device && !device.inUse.user) {
                device.inUse = {
                    user: user._id,
                    start: Date.now()
                };
                device.save(function (err) {
                    if (err) return callback(err);
                    callback(null, device);
                });
            } else {
                if (!device) {
                    return callback(new Error('ID: '+  uniqId + ' - Устройство не найдено'));
                } else {
                    callback(new Error("Устройство уже занято."), device);
                }
            }
        }
    ], callback);
};

schema.statics.unlock = function(uniqId, callback) {
    var Device = this;

    async.waterfall([
        function(callback) {
            Device.findOne({uniqId: uniqId}, callback);
        },
        function (device, callback) {
            if (device && device.inUse.user) {
                device.inUse = {
                    user: null,
                    start: null
                };
                device.save(function (err) {
                    if (err) return callback(err);
                    callback(null, device);
                });
            } else {
                if (!device) {
                    return callback(new Error('ID: '+  uniqId + ' - Устройство не найдено'));
                } else {
                    callback(new Error("Устройство уже сдано."), device);
                }
            }
        }
    ], callback);
};

exports.Device = mongoose.model('Device', schema);