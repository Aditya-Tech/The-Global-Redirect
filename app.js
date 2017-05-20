var express = require('express');
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var path = require('path');

var globe = require("./GlobeController.js");

var NodeGeocoder = require('node-geocoder');

//app.set('view engine', 'html');


app.get('/', function(req, res){
  //app.use(express.static(path.join(__dirname, './')));
  // fs.readFile(__dirname + '/index.html', function (err, data) {
  //    if (err) {
  //      res.writeHead(500);
  //      return res.end('Error loading index.html');
  //    }
  //
  //    res.writeHead(200);
  //    res.end(data);
  //  });



  var worldFeed = globe.worldFeed;
  var artsFeed = globe.artsFeed;

  request(worldFeed, function(error, response, html){

      if(!error){
          var $ = cheerio.load(html);

      // var title, release, rating;
      // var json = { title : "", release : "", rating : ""};
      //
      // $('.el-editorial-source').filter(function(){
      //     var data = $(this);
      //     title = data.text();
      //     release = data.children().last().children().text();
      //
      //     json.title = title;
      //     json.release = release;
      // })
      //
      // $('.star-box-giga-star').filter(function(){
      //     var data = $(this);
      //     rating = data.text();
      //
      //     json.rating = rating;
      // })

      var options = {
        provider: 'google'
      };

      var geocoder = NodeGeocoder(options);

      var titles = [];
      var links = [];
      var locations = [];

      $('title').each(function(i, elem) {
        titles[i] = $(this).text() + "\n"
      });

      titles.shift();
      titles.shift();

      $('description').each(function(i, elem) {
        locations[i] = $(this).text().slice(0, $(this).text().indexOf("(Reuters)"));
        if (locations[i].indexOf('/') > -1) {
          locations[i] = locations[i].slice(0, locations[i].indexOf('/'));
        };
      });

      locations.shift();

      locations.forEach(function(value){
        geocoder.geocode(value, function(err, res) {
          console.log(value)
          if (res == null) {
            locations.indexOf[value] = null
          } else {
            locations.indexOf[value] = [res[0].latitude, res[0].longitude]
          }
      });
      //return res.render('index')

    });





      // for (var i = 0; i < locations.length; i++) {
      //   var temp = [];
      //   var current = locations[i];
      //
      //   geocoder.geocode(current, function(err, res) {
      //     console.log(current)
      //     // if (res != undefined) {
      //     //   temp.push(res[0].latitude);
      //     //   temp.push(res[0].longitude);
      //     // } else {
      //     //   console.log(locations[i] + " is undefined");
      //     // }
      //
      //   })
      //
      //   // locations[i] = temp;
      //
      // }


      $("link").each(function(i, elem) {
        links[i] = $(this).text();
      });

      links.shift();
      links.shift();

      console.log(titles.length);
      console.log(locations.length);
      console.log(links.length);
      console.log(locations);

      var toClient = {
        titles: titles,
        links: links,
        locations: locations
      }

      //eturn res.send(toClient)

    }

  });
  return res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen('3000')
console.log('Check port 3000!')
