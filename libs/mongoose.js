var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('config.json')('./config/server.json');
mongoose.connect(config.mongoose.uri, {
  useMongoClient: true,
});
//debug
//console.log(config.mongoose.uri);
//mongoose.connect('mongodb://localhost:27017/urls');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB at: " + config.mongoose.uri);
});
//Schemas
var Schema = mongoose.Schema;
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
//Counter Schema end

var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
});

urlSchema.pre('save', function(next){
  var doc = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, counter) {
      if (error)
          return next(error);
      doc.created_at = new Date();
      doc._id = counter.seq;
      next();
  });
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
