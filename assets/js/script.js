//script for weather dashboard

var cityInputEl = document.getElementById("cityInput");
var searchButtonEl = document.getElementById("searchBtn");
var currentConditionsEl = document.getElementById("current");

var searchCityHandler = function() {
    //extract value of input and trim excess spaces
    var city = cityInputEl.value.trim();
    
    //confirm that data was entered into field
    if (city) {
        // console.log(city);
        getCurrentWeather(city);
        getForecast(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.")
    }
};

var getCurrentWeather = function(city) {
    // debugger;
    var currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"
    // console.log(currentWeatherApiUrl);
    fetch (currentWeatherApiUrl).then(function(response) {
        
            if (response.ok) {
                return response.json().then(function(response) {
                    console.log(response);
                    var currentWeathericon = document.createElement("img");
                    currentWeathericon.src="http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
                    currentWeathericon.setAttribute("class", "icon");
                    var currentCity = response.name;
                    var currentTemp = response.main.temp;
                    var currentHumidity = response.main.humidity;
                    var currentWind = response.wind.speed;
                    var currentDate = moment().format("MM/DD/YYYY");
                    console.log(currentWeathericon);
                    console.log(currentTemp);
                    console.log(currentHumidity);
                    console.log(currentWind);

                    currentConditionsEl.innerHTML = "<span><h2>" + currentCity + " (" + currentDate + ") <img" + currentWeathericon + "></h2></span></br><h3>Temperature: </h3>" + currentTemp + " &degF </br> <h3>Humidity: </h3>" + currentHumidity + "% </br> <h3>Wind Speed: </h3>" + currentWind + " MPH";

                    currentConditionsEl.append(currentWeathericon);
                });
            } else {
                alert("City not found.");
            }
        })
  
    

};

var getForecast = function(city) {

    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"
    console.log(forecastApiUrl);

    fetch (forecastApiUrl).then(function(response) {
        
        if (response.ok) {
            return response.json().then(function(response) {
                console.log(response);
                // var currentWeathericon = document.createElement("img");
                // currentWeathericon.src="http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
                // currentWeathericon.setAttribute("class", "icon");
})
        };
    });
};

searchButtonEl.addEventListener("click", searchCityHandler);


// var searchEl = $("#searchForm")
// var searchButtonEl = $("#searchBtn");
// var cityInputEl = document.getElementById("cityInput");
// var currentConditionsEl = $("#current")
// var forecastEl = $("#forecast")



// var searchCityHandler = function () {
    // event.preventDefault();
// debugger;
// var city = cityInputEl.val.trim;
//     console.log(city);

    // if (city) {
    //     getCurrentWeather(city);
    //     cityEl.value = "";
    // } else {
    //     alert("Please enter a city name.")
    // }

    // localStorage.setItem("city", city);
    // var citySearch = localStorage.getItem("city");
    // searchEl.append(citySearch);
// };

// var getCurrentWeather = function(city) {
// debugger;
// var currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city.text + "&appid=2c377231fe09e8bb558e96aed67feee2"

// fetch (currentWeatherApiUrl).then(function(response) {
//     if (response.ok) {
//         response.JSON().then(function(data) {
//             console.log(response);
//         });
//     } else {
//         alert("City not found.");
//     }
// })

// };

// displayCurrentWeather = function() {
    //display current conditions in #current
    //display city name
    //display current date - in parentheses
    //display current weather icon
    //display current temperature with label
    //display current humidity with label
    //display current wind speed with label
    //display UV index with label and color-coded
// }

// displayForecast = function() {
    //display 5-day forecast in #forecast
// }
// searchButtonEl.addEventListener("click", searchCityHandler(cityInputEl));