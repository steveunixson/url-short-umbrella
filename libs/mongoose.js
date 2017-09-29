"use strict";

var log = require('./log')(module);
var config = require('config.json')('./config/server.json');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //Deprecation Warning fix kinda works
mongoose.connect(config.mongoose.uri, {
  useMongoClient: true,
});
//mongoose.set('debug', true);

//-------------------ERROR HANDLER---------------//
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});
//-------------------ERROR HANDLER---------------//

var Schema = mongoose.Schema;

var CounterSchema = new Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
});

var counter = mongoose.model('counter', CounterSchema);

// create a schema for our links
var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
});

urlSchema.pre('save', function(next){
  var doc = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: { seq: 1} }, {new: true, upsert: true}).then(function(count, error) {
      if (error)
          return next(error);
      doc.created_at = new Date();
      console.log("...count: "+JSON.stringify(count));
      doc._id = counter.seq;
      next();
  })
  .catch(function(error) {
        console.error("counter error-> : "+error);
        throw error;
    });
});

log.debug('Mongoose reporting in....');

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
