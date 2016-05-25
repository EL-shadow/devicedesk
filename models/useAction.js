/**
 * Created by el on 22.05.16.
 */
var async = require('async');
var util = require('util');

var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    take: { //true - take device, false - return device
        type: Boolean,
        required: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});


exports.useAction = mongoose.model('useAction', schema);