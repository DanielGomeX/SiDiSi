var express = require('express');
var path = require('path');
var plugins = require('./plugins/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/plugins', plugins);

app.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Simple Digital Signage',
        description: 'Simple Digital Signage (SiDiSi) is your information screen with rss news feeds, weather information and google calendar cards.'
    });
});

app.get('/settings', function(req, res, next) {
    res.render('settings', {
        title: 'Settings',
        description: 'Change your SiDiSi settings to mazimixe your experience. You can switch through news and weather information plugins and add your google calendars.'
    });
});

app.get('/settings/clear', function(req, res, next) {
    res.render('settings', {
        title: 'Settings',
        description: 'Reset your SiDiSi settings.',
        action: 'clear'
    });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', {
        title: 'Error',
        description: 'Something went wrong or the SiDiSi page you requested is not available'
    });
});

module.exports = app;
