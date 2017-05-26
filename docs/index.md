---
layout: default
---

## SiDiSi

Simple Digital Signage is an information screen which can be used by everyone. Make use of it at home to display the latest news and calendar appointments that you always stay informed. Or you set it up in your company building, code your own plugins and present your enterprise blog entries to your employees.

You are able to use different plugins for news, you can switch your OpenWeatherMap location and add your own google calendar.

## How to install SiDiSi

If you do not have special needs for your digital signage screen you can just open [SiDiSi Live App](https://news.sidisi.de), go to the settings page and insert your OpenWeatherMap location, API Key and your Google Mail address.

## Plugins

### Plugin Overview

There are prepared plugins, which you can use out of the box. There are to types of plugins at the moment.

*   news (rss) feeds
*   weather Information

### API Structure

##### News feeds

When coding your own plugin you have to structure your response like the following format.

```json
{
	"feeds": [{
		"image": "https://path-to-image/",
		"title": "News Title",
		"text": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed",
		"link": "https://path-to-full-post/"
	}]
}
```

##### Weather information

When coding your own plugin you have to structure your response like the following format.

```json
{
	"location": "London",
	"temp": 20,
	"humidity": 80,
	"sunrise": 1491369961000,
	"sunset": 1491417671000,
	"icon": "day-sunny"
}
```

Possible parameters at icon are:

*   day-sunny
*   night-clear
*   day-cloudy
*   night-alt-cloudy
*   cloud
*   cloudy
*   showers
*   day-rain
*   night-alt-rain
*   thunderstrom
*   snow
*   day-haze
*   dust
*   default: na
