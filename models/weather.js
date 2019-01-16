const mongoose = require('mongoose');

 // THE MAIN FIELDS ARE latitude , longitude, city, current timestamp, currently(all), weekly (time, temphigh, tempLow, humidity)

const WeatherSchema = mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    } , 
    city: {
        type: String,
        require: true
    }, 
    datetime: {
        type: Date,
        require: true
    },
    currently: {
        type: String,
        require: true
    },
    weekly: {
        type: String,
        require: true
    }
});

const weather = module.exports = mongoose.model('Weather', WeatherSchema);

module.exports.newWeather = (newWeather, callback) => { 
    newWeather.save(callback);
}

module.exports.findWeatherByLatLong = (lat, long, date, callback) => {
    console.log(date);
    let dateOneHourBefore = new Date(date.getTime()-(60*60*1000));
    console.log(dateOneHourBefore);
    let query = {
        latitude: lat,
        longitude: long,
        datetime: {$gte : dateOneHourBefore}
    };
    weather.findOne(query, callback);
}
