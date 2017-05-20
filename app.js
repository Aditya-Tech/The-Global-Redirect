var express = require('express');
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var path = require('path');
var globe = require("./GlobeController.js");


app.get('/', function(req, res){

  fs.readFile(__dirname + '/index.html', function (err, data) {
     if (err) {
       res.writeHead(500);
       return res.end('Error loading index.html');
     }

     res.writeHead(200);
     res.end(data);
   });
 });


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
      });

      locations.shift();


      $("link").each(function(i, elem) {
        links[i] = $(this).text();
      });

      links.shift();
      links.shift();

      console.log(titles.length);
      console.log(locations.length);
      console.log(links.length);
      console.log(locations)

      var toClient = {
        titles: titles,
        links: links,
        locations: locations
      }
    }
  });




app.listen('3000')
console.log('Check port 3000!')
