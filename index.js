'use strict';

var express = require('express');
var app = express();
var jsonfile = require('jsonfile')
var controller = require('./app/controller');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  var city = 'Frankfurt'
  controller.get({
      city: city
    })
    .then((trafficIncidents) => {
      var incidents
      // check if traffic incidents are available
      if (typeof(trafficIncidents.TRAFFICITEMS) != "undefined") {
        incidents = trafficIncidents.TRAFFICITEMS.TRAFFICITEM
      } else {
        incidents = 'empty'
      }
      res.render('app/view.jade', {
        title: 'Verkehrsstörungen',
        trafficIncidents: incidents,
        city: city
      });
    });
});

app.listen(8080, function() {
  console.log('App listening on port 8080!');
});