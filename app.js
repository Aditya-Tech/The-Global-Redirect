var express = require('express');
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var path = require('path');

var globe = require("./GlobeController.js");

var NodeGeocoder = require('node-geocoder');
var feeds = globe.reuters;

getData(feeds);

function getData(feeds) {

  var titles = [];
  var links = [];
  var locations = [];

  feeds.forEach(function(feed) {
    request(feed, function(error, response, html){

        if (!error) {

          var $ = cheerio.load(html);

          var tempTitles = [];
          var tempLinks = [];
          var tempLocs = [];


          $('title').each(function(i, elem) {
            tempTitles[i] = $(this).text() + "\n"
          });

          tempTitles.shift();
          tempTitles.shift();

          $('description').each(function(i, elem) {
            tempLocs[i] = $(this).text().slice(0, $(this).text().indexOf("(Reuters)"));

            if (tempLocs[i].indexOf('/') > -1) {
              tempLocs[i] = tempLocs[i].slice(0, tempLocs[i].indexOf('/'));
            };
          });

          tempLocs.shift();

          $('guid').each(function(i, elem) {
            tempLinks.push($(this).text());
          });



          console.log(tempTitles.length);
          console.log(tempLocs.length);
          console.log(tempLinks.length);

          titles.push(tempTitles);
          links.push(tempLinks);
          locations.push(tempLocs);

          if (titles.length == 3) {
            var toClient = {
              titles: titles,
              links: links,
              locations: locations
            }

            return setData(toClient);

          };
        };
      });
    })

}

app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'jade');

function setData(data) {
  app.get('/', function(req, res){
    //console.log(data.titles)
    res.render('scratchwork', {data:data});


  });

}




app.listen('3000')
console.log('Check port 3000!')
