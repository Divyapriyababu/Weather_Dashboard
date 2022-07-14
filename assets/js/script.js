var searchButtonEl = $('#form-element');
var cityNameEl = $('#form1');
var searchHistoryButtonEl = $('#button-list');
var searchHistoryEl = $('#search-history');
var cityNameResponse = document.getElementById('city-name');
var tempValueResponse = document.getElementById('temp-value');
var windValueResponse = document.getElementById('wind-value');
var humidityValueResponse = document.getElementById('humidity-value');
var uvIndexValueResponse = $('#uvi-value');

// Funtion to get weather info given city name
function getWeatherCurrentInfo(city) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q= '+ city +'&appid=2b7b84a7e69af0625b82dfd4f339e129&units=metric';
    fetch(requestUrl)
    .then(function (response) {
        response.json().then(function (data) {
            var today = moment.unix(data.dt).format('MM/DD/YYYY')
            cityNameResponse.textContent = city + " (" + today + ")";

            var cityEl = $('#city-name');
            var icon = $('<img>');
            icon.attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
            icon.css('display', 'inline-block');

            cityEl.append(icon);

            tempValueResponse.textContent = "Temp : " + data.main.temp + " °C";
            windValueResponse.textContent = "Wind : " + data.wind.speed + " MPH";
            humidityValueResponse.textContent = "Humidity : " + data.main.humidity + " %";

            // Add to local storage
            var cityInLocalStorage = localStorage.getItem('CITY_NAME') || '[]'; // '['Seattle']'
            var cityJson = JSON.parse(cityInLocalStorage); // ['Seattle']
            if (!cityJson.includes(city)) {
                cityJson.push(city); // ['Seattle' , 'Atlanta']
            }
            localStorage.setItem('CITY_NAME',JSON.stringify(cityJson));

            // Call forecast
            var cityLatitude = data.coord.lat;
            var cityLongitude = data.coord.lon;
            getWeatherForecast(cityLatitude, cityLongitude);
        });
    });
}

// Funtion to get forecast weather info given lat and long
function getWeatherForecast(latitude,longitude) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ latitude +'&lon='+ longitude +'&exclude=minutely,hourly&appid=2b7b84a7e69af0625b82dfd4f339e129&units=metric';
    fetch(requestUrl)
    .then(function (response) {
        response.json().then(function (data) {
        uvIndexValueResponse.text("UV Index: ");

        var uviPEl = $('<span>');
        uvIndexValueResponse.append(uviPEl);
        uviPEl.attr('class', 'uvi_value_span');
        uviPEl.text(data.current.uvi);

        if(data.current.uvi <= 2) {
            uviPEl.css('background-color', 'green');
        } else if (data.current.uvi <= 5) {
            uviPEl.css('background-color', 'yellow');
        } else if (data.current.uvi <= 7) {
            uviPEl.css('background-color', 'orange');
        } else if (data.current.uvi <= 10) {
            uviPEl.css('background-color', 'red');
        } else {
            uviPEl.css('background-color', 'violet');
        }

        var forecastCards = document.getElementById('forecast-cards');
        removeAllChildNodes(forecastCards);

        var forecastDays = $('#forecast-days');
        forecastDays.text('5-Day Forecast:');

        var rootEl = $('#forecast-cards');
        // Iterate through forecast and create HTML divs and append to the corresponding row
        for (var i = 1; i < 6; i++) {
            var dateForecast = moment.unix(data.daily[i].dt).format('MM/DD/YYYY') ;
            
            var titleEl = $('<div>');
            titleEl.attr('class', 'card');
            rootEl.append(titleEl);

            var cardEl = $('<div>');
            cardEl.attr('class', 'card-body');
            titleEl.append(cardEl);

            var dateEl = $('<h5>');
            dateEl.attr('class', 'card-title');
            dateEl.attr('id', 'city-date-forecast');
            cardEl.append(dateEl);
            dateEl.text(dateForecast);

            var icon = $('<img>');
            icon.attr('src', 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png');
            cardEl.append(icon);

            createForecastCard('temp-value-forecast', "Temp : " + data.daily[i].temp.day, cardEl);
            createForecastCard('wind-value-forecast', "Wind : " + data.daily[i].wind_speed, cardEl);
            createForecastCard('humidity-value-forecast', "Humidity : " + data.daily[i].humidity, cardEl);
        }
    });
});
}

function createForecastCard(id, text, element) {
    var abilityEl = $('<p>');
    abilityEl.addClass('card-text');
    abilityEl.attr('id', id);
    abilityEl.text(text)
    element.append(abilityEl);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

searchButtonEl.on('submit', function(event) {
    event.preventDefault();
    // Call weather API
    getWeatherCurrentInfo(cityNameEl.val());
});

// Add buttons for history
var cityInLocalStorage = localStorage.getItem('CITY_NAME') || '[]'; // '['Seattle']'
var cityJson = JSON.parse(cityInLocalStorage); // ['Seattle']

for (var i = 0; i < cityJson.length; i++) {
    var buttonEl = $('<button>');
    buttonEl.attr('class', 'btn btn-secondary btn-block');
    buttonEl.attr('type', 'button');
    buttonEl.attr('id', 'button-list')
    searchHistoryEl.append(buttonEl);
    buttonEl.text(cityJson[i]);
    buttonEl.on('click', function() {
        // Call weather API
        getWeatherCurrentInfo(this.innerHTML);
    });
}