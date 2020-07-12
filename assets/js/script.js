//script for weather dashboard

var cityInputEl = document.getElementById("cityInput");
var searchButtonEl = document.getElementById("searchBtn");
var currentConditionsEl = document.getElementById("current");
var uvValueEl = document.getElementById("uvValue");
var forecastEl = document.getElementById("forecast")
var historyEl = document.getElementById("history");
var citySearchResultsEl = document.getElementsByClassName("searchHistory");
// var currentConditionsIconEl = document.getElementById("icon");
// var currentTempEl = document.getElementById("temp");
// var currentHumidityEl = document.getElementById("humidity");
// var currentWindEl = document.getElementById("wind");
// var dateYesterdayEl = document.getElementById("dateYesterday");


var searchCityHandler = function () {

    currentConditionsEl.innerHTML = "";
    forecastEl.innerHTML = "";
    //extract value of input and trim excess spaces
    var city = cityInputEl.value.trim();

    //confirm that data was entered into field
    if (city) {
        // console.log(city);
        getCurrentWeather(city);
        getForecast(city);
        saveCity(city);
        cityInputEl.value = "";

        
    } else {
        alert("Please enter a city name.")
    }
  
};

var saveCity = function(city) {
    var cityNames = [city];
        localStorage.setItem("city", JSON.stringify(cityNames));
        console.log(cityNames);
        loadCity();
       
};

var loadCity = function() {
    // debugger;
       var citySearch = JSON.parse(localStorage.getItem("city"));
        console.log(citySearch);
     for (i = 0; i < citySearch.length; i++) {
        var searchEl = document.createElement("div");
        searchEl.classList.add("card", "searchHistory")
        searchEl.textContent = citySearch[i];
        console.log(searchEl);
            // searchEl.append(citySearch);
            historyEl.append(searchEl);
}
// citySearchResultsEl.addEventListener("click", searchSavedCityHandler);
};

var searchSavedCityHandler = function() {
    var searchSavedCity = $(this).value;
    console.log(searchSavedCity);
};




var getCurrentWeather = function (city) {
    // debugger;
    var currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"
    // console.log(currentWeatherApiUrl);
    fetch(currentWeatherApiUrl).then(function (response) {

        if (response.ok) {
            return response.json().then(function (response) {
                // console.log(response);
                // debugger;
                var currentDate = moment().format("MM/DD/YYYY");
                var currentContainerEl = document.createElement("div");
                currentContainerEl.classList.add("card", "border-1", "border-secondary", "inline");
                var currentEl = document.createElement("h2");
                currentEl.textContent = response.name + " (" + currentDate + ") ";

            
                var currentWeatherIcon = document.createElement("img");
                currentWeatherIcon.src = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
                currentWeatherIcon.alt = response.weather[0].description;
                currentWeatherIcon.setAttribute("class", "icon");
                // console.log(currentWeatherIcon);
                currentEl.append(currentWeatherIcon);

                var currentTempEl = document.createElement("h4");
                currentTempEl.innerHTML = "<h4>Temperature: " + response.main.temp + "&degF</h4>";

                var currentHumidityEl = document.createElement("h4");
                currentHumidityEl.textContent = "Humidity: " + response.main.humidity + "%";

                var currentWindEl = document.createElement("h4");
                currentWindEl.textContent = "Wind Speed: " + response.wind.speed + "MPH";

                // var umidityEl.textContent = currentHumidity;
                // var currentWind = response.wind.speed;
                // currentWindEl.textContent = currentWind;

                //identify latitude and longitude of search city
                var lat = response.coord.lat;
                // console.log(lat);
                var lon = response.coord.lon;
                // console.log(lon);

                //fetch UV index info                
                var currentUVApiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=2c377231fe09e8bb558e96aed67feee2&lat=" + lat + "&lon=" + lon;
                fetch(currentUVApiUrl).then(function (response) {

                    if (response.ok) {
                        return response.json().then(function (response) {
                            var currentUvEl = document.createElement("h4");
                            currentUvEl.textContent = "UV Index: ";
                            var uvButtonEl = document.createElement("button");
                            uvButtonEl.textContent = response.value;
                            uvButtonEl.classList.add("text-white", "rounded", "border-0");

                            // console.log(currentUvEl);

                            if (response.value < 3) {
                                uvButtonEl.classList.add("bg-success");
                            } else if (response.value < 7) {
                                uvButtonEl.classList.add("bg-warning");
                            } else {
                                uvButtonEl.classList.add("bg-danger");
                            }
                            currentUvEl.append(uvButtonEl);
                            currentEl.appendChild(currentUvEl);
                        })
                    }
                });
                
                
                currentEl.appendChild(currentTempEl);
                currentEl.appendChild(currentHumidityEl);
                currentEl.appendChild(currentWindEl);
                // currentEl.appendChild(currentUvEl);
                currentConditionsEl.append(currentEl);
             });
        } else {
            alert("City not found.");
        }
    })



};

var getForecast = function (city) {

    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"
    // console.log(forecastApiUrl);

    fetch(forecastApiUrl).then(function (response) {

        if (response.ok) {
            return response.json().then(function (response) {
                // console.log(response);

                forecastEl.innerHTML = "<h4 class='mt-3'>5-Day Forecast:</h4>";
                var forecastRowEl = document.createElement("div");
                forecastRowEl.className = "row";
                var divEl = document.createElement("div");
                divEl.classList.add("card-deck");


                for (i = 0; i < response.list.length; i++) {
                    if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        console.log(response.list[i]);
                        
                        var cardEl = document.createElement("div");
                        cardEl.classList.add("card", "bg-primary", "text-white");
                        var dateEl = document.createElement("h5");
                        date = response.list[i].dt_txt;
                        dateEl.textContent = moment(date).format("MM/DD/YYYY");
                        // console.log(date);
                        var iconEl = document.createElement("img");
                        iconEl.src = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                        iconEl.alt = response.list[i].weather[0].description;
                        iconEl.setAttribute("class", "icon");
                        var tempEl = document.createElement("p");
                        tempEl.innerHTML = "<p>Temp: " + response.list[i].main.temp + "&degF</p>";
                        // console.log(tempEl);
                        var humidityEl = document.createElement("p");
                        humidityEl.textContent = "Humidity: " + response.list[i].main.humidity + "%";
                        // console.log(humidityEl);

                        cardEl.appendChild(dateEl);
                        cardEl.appendChild(iconEl);
                        cardEl.appendChild(tempEl);
                        cardEl.appendChild(humidityEl);
                        divEl.appendChild(cardEl);
                        forecastEl.append(divEl);

                    }
                }




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