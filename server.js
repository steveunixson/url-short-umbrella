//just for a reference
//Base58.encode(6857269519);
//Base58.decode('brXijP');
//TODO: automate a fail scenario and backup at least a port
var bodyParser = require('body-parser');
var port = 3000; 
var base58 = require('./base58');
var express = require('express'); //express init
var app = express();			 //
var path = require('path'); //path module init
var Url = require('./url'); //link the db model
var config = require('config.json')('./server.json'); //add config file via config.js package
var mongoose = require('mongoose');
//`open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead FIX IT
mongoose.connect('mongodb://' + config.db_host + '/' + config.db_name, {
	useMongoClient: true,
});
//f*cking body parser DO NOT FORGET IT NEXT TIME!!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //too underscores!! 

app.get('/', function (req, res) {
  res.sendFile(path.join(_dirname, 'public/index.html')); //route to serve a home page
});

app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      shortUrl = config.webhost + base58.encode(doc._id);

      // the document exists, so we return it without creating a new entry
      res.send({'shortUrl': shortUrl});
    } else {
      // since it doesn't exist, let's go ahead and create it:
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        shortUrl = config.webhost + base58.encode(newUrl._id);

        res.send({'shortUrl': shortUrl});
      });
    }

  });

});

app.get('/:encoded_id', function(req, res){

  var base58Id = req.params.encoded_id;

  var id = base58.decode(base58Id);

  // check if url already exists in database
  Url.findOne({_id: id}, function (err, doc){
    if (doc) {
      res.redirect(doc.long_url);
    } else {
      res.redirect(config.webhost);
    }
  });

});



//Start HTTP server
var server = app.listen(port, function () {
  console.log('We are alive at ' + port);
  console.log('db_host and db_name variables are ' + config.db_host + '/' + config.db_name);
});
