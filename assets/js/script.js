var searchButtonEl = $('#form-element');
var cityNameEl = $('#form1');
var cityNameResponse = document.getElementById('city-name');
var tempValueResponse = document.getElementById('temp-value');
var windValueResponse = document.getElementById('wind-value');
var humidityValueResponse = document.getElementById('humidity-value');

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
            // Call forecast
        });
    });
}

searchButtonEl.on('submit', function(event) {
    event.preventDefault();
    console.log('City name:', cityNameEl.val());
    // Call weather API
    getWeatherCurrentInfo(cityNameEl.val());
});
