var express = require('express');
var router = express.Router();
var newsWelt = require('./news/welt');
var weatherOpenWeatherMap = require('./weather/openweathermap');

router.get('/', function(req, res, next) {
    res.send('plugins dir');
});

router.get('/news/list', function(req, res, next) {
    res.json({
        "newsProviders": [
            require('./news/welt.json')
        ]
    });
});

router.get('/weather/list', function(req, res, next) {
    res.json({
        "weatherProviders": [
            require('./weather/openweathermap.json')
        ]
    });
});

router.get('/news/welt', newsWelt);

router.get('/weather/openweathermap/:city/:apikey', weatherOpenWeatherMap);

module.exports = router;
