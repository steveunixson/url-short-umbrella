var express = require('express');
var app = express();
var config = require('config.json')('./config/server.json');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var log = require('./libs/log')(module);
var Url = require('./libs/mongoose');
var base58 = require('./libs/base58');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(express.static(path.join(__dirname, "public")));
app.get('/', function (req, res) {
  res.sendFile(path.join(_dirname, 'public/index.html')); //route to serve a home page
});

//----------------ERROR HANDLER--------------------------//

//-------------------------------------------------//
app.post('/api/shorten', function(req, res){
  var longUrl = req.body.url;
  var shortUrl = '';
  log.debug('Input URL is: ' + req.body.url);

  // check if url already exists in database
	//TODO define query line 45
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
var server = app.listen(config.port, function () {
  log.info('We are alive at ' + config.port);
	log.debug(config.webhost);
});
//-----------------------------------------------//
