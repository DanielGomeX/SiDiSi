var http = require('http');

module.exports = function(req, res, next) {
    var options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?q=' + req.params.city + '&appid=' + req.params.apikey + '&units=metric',
        port: 80,
        method: 'GET'
    };

    var req = http.get(options, function(response) {
        response.setEncoding('utf8');
        var body = "";
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var jsonResponse = JSON.parse(body);
            var icon = "na";
            switch (jsonResponse.weather[0].icon) {
                case "01d":
                    icon = "day-sunny";
                    break;
                case "01n":
                    icon = "night-clear";
                    break;
                case "02d":
                    icon = "day-cloudy";
                    break;
                case "02n":
                    icon = "night-alt-cloudy";
                    break;
                case "03d":
                case "03n":
                    icon = "cloud";
                    break;
                case "04d":
                case "04n":
                    icon = "cloudy";
                    break;
                case "09d":
                case "09n":
                    icon = "showers";
                    break;
                case "10d":
                    icon = "day-rain";
                    break;
                case "10n":
                    icon = "night-alt-rain";
                    break;
                case "11d":
                case "11n":
                    icon = "thunderstrom";
                    break;
                case "13d":
                case "13n":
                    icon = "snow";
                    break;
                case "50d":
                    icon = "day-haze";
                    break;
                case "50n":
                    icon = "dust";
                    break;
            }
            var response = {
                "location": jsonResponse.name,
                "temp": jsonResponse.main.temp,
                "humidity": jsonResponse.main.humidity,
                "sunrise": jsonResponse.sys.sunrise * 1000,
                "sunset": jsonResponse.sys.sunset * 1000,
                "icon": icon
            };
            res.json(response);
        });
    });

    req.on('error', function(e) {
        console.error('ERROR: ' + e.message);
    });
};
