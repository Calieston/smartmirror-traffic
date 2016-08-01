'use strict';

var express = require('express');
var app = express();
var controller = require('./app/controller');
var fs = require('fs');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  let pckg = fs.readFileSync('package.json');
  pckg = JSON.parse(pckg);

  let widget = {};
  widget._id = '1234567890';
  widget.size = pckg.smartmirror.size[0];
  widget.settings = {};
  widget.settings.timer = 10;

  var city = 'Stuttgart'
  controller.get({
      city: city
    })
    .then((data) => {
      res.render('./index.jade', {
        data: data,
        widget: widget,
      });
    });
});

app.listen(8080, function() {
  console.log('App listening on port 8080!');
});