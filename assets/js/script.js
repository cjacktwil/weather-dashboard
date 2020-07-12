var cityInputEl = document.getElementById("cityInput");
var searchButtonEl = document.getElementById("searchBtn");
var currentConditionsEl = document.getElementById("current");
var uvValueEl = document.getElementById("uvValue");
var forecastEl = document.getElementById("forecast")
var historyEl = document.getElementById("history");
var citySearchResultsEl = document.getElementsByClassName("searchHistory");


var searchCityHandler = function () {

    currentConditionsEl.innerHTML = "";
    forecastEl.innerHTML = "";
    //extract value of input and trim excess spaces
    var city = cityInputEl.value.trim();

    //confirm that data was entered into field
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        saveCity(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name.")
    }
};

var saveCity = function (city) {
    var cityNames = [city];
    localStorage.setItem("city", JSON.stringify(cityNames));
    console.log(cityNames);
    loadCity();
};

var loadCity = function () {
    var citySearch = JSON.parse(localStorage.getItem("city"));
    console.log(citySearch);
    for (i = 0; i < citySearch.length; i++) {
        var searchEl = document.createElement("div");
        searchEl.classList.add("card", "searchHistory")
        searchEl.textContent = citySearch[i];
        historyEl.append(searchEl);
    }
};

var searchSavedCityHandler = function (event) {
    var searchSavedCity = event.target.textContent;
    console.log(searchSavedCity);
    currentConditionsEl.innerHTML = "";
    forecastEl.innerHTML = "";
    getCurrentWeather(searchSavedCity);
    getForecast(searchSavedCity);
};

var getCurrentWeather = function (city) {
    var currentWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"
    fetch(currentWeatherApiUrl).then(function (response) {

        if (response.ok) {
            return response.json().then(function (response) {
                //set date and display city name and date
                var currentDate = moment().format("MM/DD/YYYY");
                var currentContainerEl = document.createElement("div");
                currentContainerEl.classList.add("card", "border-1", "border-secondary", "inline");
                var currentEl = document.createElement("h2");
                currentEl.textContent = response.name + " (" + currentDate + ") ";

                //pull icon depicting current weather conditions
                var currentWeatherIcon = document.createElement("img");
                currentWeatherIcon.src = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
                currentWeatherIcon.alt = response.weather[0].description;
                currentWeatherIcon.setAttribute("class", "icon");
                currentEl.append(currentWeatherIcon);

                //pull current temperature
                var currentTempEl = document.createElement("h4");
                currentTempEl.innerHTML = "<h4>Temperature: " + response.main.temp + "&degF</h4>";

                //pull current humidity level
                var currentHumidityEl = document.createElement("h4");
                currentHumidityEl.textContent = "Humidity: " + response.main.humidity + "%";

                //pull current wind speed
                var currentWindEl = document.createElement("h4");
                currentWindEl.textContent = "Wind Speed: " + response.wind.speed + "MPH";

                //identify latitude and longitude of search city
                var lat = response.coord.lat;
                var lon = response.coord.lon;

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

                            //add color-coding to depict uv index level danger zone
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

                //append all elements to container
                currentEl.appendChild(currentTempEl);
                currentEl.appendChild(currentHumidityEl);
                currentEl.appendChild(currentWindEl);
                currentConditionsEl.append(currentEl);
            });
        } else {
            alert("City not found.");
        }
    })
};

var getForecast = function (city) {

    var forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=2c377231fe09e8bb558e96aed67feee2"

    fetch(forecastApiUrl).then(function (response) {

        if (response.ok) {
            return response.json().then(function (response) {

                //create element to house forecast information
                forecastEl.innerHTML = "<h4 class='mt-3'>5-Day Forecast:</h4>";
                var forecastRowEl = document.createElement("div");
                forecastRowEl.className = "row";
                var divEl = document.createElement("div");
                divEl.classList.add("card-deck");


                for (i = 0; i < response.list.length; i++) {
                    //find instances in the forecast data occurring at 3 p.m. 
                    if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                        //create cards to hold forecast data
                        var cardEl = document.createElement("div");
                        cardEl.classList.add("card", "bg-primary", "text-white");
                        //create element and pull date from each instance
                        var dateEl = document.createElement("h5");
                        date = response.list[i].dt_txt;
                        dateEl.textContent = moment(date).format("MM/DD/YYYY");
                        //create element and pull icon depicting current weather conditions for each instance
                        var iconEl = document.createElement("img");
                        iconEl.src = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                        iconEl.alt = response.list[i].weather[0].description;
                        iconEl.setAttribute("class", "icon");
                        //create element and pull temperature for each instance 
                        var tempEl = document.createElement("p");
                        tempEl.innerHTML = "<p>Temp: " + response.list[i].main.temp + "&degF</p>";
                        //create element and pull humidity level for each instance
                        var humidityEl = document.createElement("p");
                        humidityEl.textContent = "Humidity: " + response.list[i].main.humidity + "%";

                        //append all elements to cards
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
historyEl.addEventListener("click", searchSavedCityHandler);