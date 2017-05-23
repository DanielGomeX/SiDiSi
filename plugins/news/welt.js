var https = require('https');
var xmlParse = require('xml2js').parseString;

module.exports = function(req, res, next) {
  var options = {
    host: 'www.welt.de',
    path: '/feeds/latest.rss',
    port: 443,
    method: 'GET'
  };

  var req = https.get(options, function(response) {
    response.setEncoding('utf8');
    var body = "";
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      xmlParse(body, function(err, result) {
        var response = {
          "feeds": []
        };
        var replace = JSON.stringify(result).replace(/content:encoded/g, "content");
        var jsonResponse = JSON.parse(replace).rss.channel[0].item;
        jsonResponse.splice(0, 1);
        for (var i in jsonResponse) {
          try {
            var feed = {
              "image": jsonResponse[i].enclosure[0].$.url,
              "title": jsonResponse[i].title[0],
              "text": jsonResponse[i].description[0],
              "link": jsonResponse[i].link[0]
            }
          } catch (e) {
            var feed = {
              "image": jsonResponse[i].enclosure[0].$.url,
              "title": jsonResponse[i].title[0],
              "text": jsonResponse[i].description,
              "link": jsonResponse[i].link[0]
            }
          }
          response.feeds.push(feed);
        }
        res.json(response);
      });
    });
  });

  req.on('error', function(e) {
    console.error('ERROR: ' + e.message);
  });
};
