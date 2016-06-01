'use strict';

var express = require('express');
var app = express();

var controller = require('./app/controller');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  let city = 'Frankfurt'
  controller.get({city: city})
  .then((trafficIncidents) => {
    console.log('NUMBER OF INCIDENTS :'+trafficIncidents.TRAFFICITEMS.TRAFFICITEM.length);
/*    console.log(trafficIncidents.TRAFFICITEMS.TRAFFICITEM['0']);
    console.log(trafficIncidents.TRAFFICITEMS.TRAFFICITEM['0'].TRAFFICITEMDESCRIPTION['1'].content);
    console.log(trafficIncidents.TRAFFICITEMS.TRAFFICITEM['0'].STARTTIME);
    console.log(trafficIncidents.TRAFFICITEMS.TRAFFICITEM['0'].ENDTIME);
    console.log(trafficIncidents.TIMESTAMP);*/

    res.render('app/view.jade', {
      title: 'Verkehrsmeldungen',
      trafficIncidents: trafficIncidents
    });
  });
});

app.listen(8080, function () {
  console.log('App listening on port 8080!');
});