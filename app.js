const express = require("express");
const app = express();
const _ = require("lodash");

const https = require("https");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

var city=""; //can specify default city here
const api_key = "0c4854c188121a765faef4576821f33b";

app.get("/", function (req, res) {
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + api_key+"&units=metric";
    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            if (weatherData['cod'] == 200) {
                var description = weatherData.weather[0].description;
                var windspeed = weatherData.wind.speed;
                var icon = weatherData.weather[0].icon;
                var temp = weatherData.main.temp;
                res.render("index", {
                    error:false,
                    city: city,
                    desc: description,
                    speed: windspeed,
                    icon: icon,
                    temp:temp
                });
            }
            else{
                res.render("index", {
                    error:true,
                    city:city
                })
            }
        });
    });
});


app.post("/", function (req, res) {
    city = _.capitalize(req.body.newCity);
    res.redirect("/");
})

app.listen(3000, function (req, res) {
    console.log("server is running at port 3000.");
});

