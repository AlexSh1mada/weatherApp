let weather = {
    apiKey: "9ff238fc31084e2dca388ea61d54c1d5",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
         + city 
         + "&units=metric&appid=" 
         + this.apiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        let clientID = "aKxyJLXDw27b2wgAla7VCMagftTv8zDoe5jwfxm39EM";

        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;

        const image = `https://api.unsplash.com/photos/random?query=${name}&client_id=${clientID}`;

        //console.log(name, icon, description, temp, humidity, speed);
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        fetch(image)
        .then(response => response.json())
        .then(jsonData => {
          document.body.style.backgroundImage = `url(${jsonData.urls.regular})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundPosition = 'center';
          document.querySelector("footer a").href = jsonData.links.html;
          document.querySelector("footer a").innerHTML = jsonData.user.name;
          console.log(jsonData) 

        })
        .catch(err => {
          console.error('Error fetching image: ', err)
        })

    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

let geocode = {
    reverseGeoCode: function (latitude, longitude) {
        var api_key = '01b3e909f9ae4f06b15db4c7202586ec';
      
        var api_url = 'https://api.opencagedata.com/geocode/v1/json'
      
        var request_url = api_url
          + '?'
          + 'key=' + api_key
          + '&q=' + encodeURIComponent(latitude + ',' + longitude)
          + '&pretty=1'
          + '&no_annotations=1';
      
        // see full list of required and optional parameters:
        // https://opencagedata.com/api#forward
      
        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);
      
        request.onload = function() {
          // see full list of possible response codes:
          // https://opencagedata.com/api#codes
      
          if (request.status == 200){
            // Success!
            
            var data = JSON.parse(request.responseText);
            console.log(data.results[0]); // print the location
            weather.fetchWeather(data.results[0].components.county);
      
          } else if (request.status <= 500){
            // We reached our target server, but it returned an error
      
            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
          } else {
            console.log("server error");
          }
        };
      
        request.onerror = function() {
          // There was a connection error of some sort
          console.log("unable to connect to server");
        };
      
        request.send();  // make the request
    },
    getLocation: function(){
        function success (data) {
            geocode.reverseGeoCode(data.coords.latitude, data.coords.longitude);
        }
    if (navigator.geolocation){
         navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
        weather.fetchWeather("London"); 
    }
    } 
}

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if(event.key == "Enter") {
        weather.search();
    }
});

geocode.getLocation();