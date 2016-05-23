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

exports.Device = mongoose.model('Device', schema);