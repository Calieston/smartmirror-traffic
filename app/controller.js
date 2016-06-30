'use strict';

var NodeGeocoder = require('node-geocoder');

// define options
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyDlEDsLuMljAMnvo-2INfm9Ru7bbICBWo4',
  formatter: null
};

var geocoder = NodeGeocoder(options);

exports.get = function(params) {
  // Return new Promise
  return new Promise((resolve, reject) => {

    let city = params.city
    let zoom = '15000'
    let app_id = 'CJKsdR5hFvi0463h2W9H'
    let app_code = 'n5pTnhodrqg6vCAfVYCewA'
      // convert city to coordinates
    geocoder.geocode(city)
      .then(function(res) {
        let lat = res['0'].latitude
        let long = res['0'].longitude
        let urlStart = 'https://traffic.cit.api.here.com/traffic/6.0/incidents.json?prox=' + lat
        let urlEnd = '%2C' + long + '%2C' + zoom + '&criticality=0%2C1&app_id=' + app_id + '&app_code=' + app_code
          // Select http or https module, depending on reqested url
        const lib = urlStart.startsWith('https') ? require('https') : require('http');

        // Fire the get request
        const request = lib.get(urlStart + urlEnd, (response) => {

          // Handle http errors
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load traffic incidents, status code: ' + response.statusCode));
          }
          // Temporary data holder
          const body = [];

          // On every content chunk, push it to the data array
          response.on('data', (chunk) => {
            body.push(chunk);
          });

          // We are done, resolve promise with those joined chunks
          response.on('end', () => {
            var list = JSON.parse(body.join(''));
            var newList = [];
            list.TRAFFICITEMS.TRAFFICITEM.forEach(function(item) {
              var newItem = {};
              newItem.start = new Date(item.STARTTIME).toLocaleString();
              newItem.end = new Date(item.ENDTIME).toLocaleString();
              if(typeof(item.LOCATION.DEFINED) != 'undefined') {
                if(typeof(item.LOCATION.DEFINED.ORIGIN) != 'undefined') {
                  newItem.location = item.LOCATION.DEFINED.ORIGIN.ROADWAY.DESCRIPTION['0'].content;
                }
              }
              newItem.description = item.TRAFFICITEMDESCRIPTION['0'].content;
              newList.push(newItem);
            });
            console.log(newList);
            resolve(newList);
          });
        });

        // Handle connection errors of the request
        request.on('error', (err) => {
          reject(err);
        });
      })
      .catch(function(err) {
        console.log(err);
      });

  });
};