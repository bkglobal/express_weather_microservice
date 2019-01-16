const express = require('express');
const https = require('https');
const weather = require('../models/weather');
const route = express.Router();



// ROUTE / MAIN

route.post('/', (req, res) => {
    const url = "https://api.darksky.net/forecast/5bf250c03466a8aaf440be51e90690a8/"+req.body.lat+","+req.body.long+"?units=si&exclude=hourly,flags";

    if(req.body.lat == null || req.body.long == null  || req.body.lat == undefined || req.body.long == undefined){
        return res.json({
               'status': 'FAILED',
               'msg': 'Params are required',
        });
   } else if(!(req.body.lat >= 0 || req.body.long >= 0)) {
    return res.json({
        'status': 'FAILED',
        'msg': 'Only Numbers are allowed for latitude and longitude.',
    });
   }

    // latitude , longitude, city, current timestamp, currently(all), weekly (time, temphigh, tempLow, humidity)
    console.log(req.body);
    weather.findWeatherByLatLong(req.body.lat, req.body.long, new Date(), (err, resGetWeather) => {
        if (resGetWeather) { 

            resGetWeather['currently'] = JSON.parse(resGetWeather.currently);
            data = {
                latitude: resGetWeather.latitude,
                longitude: resGetWeather.longitude,
                city: resGetWeather.city,
                datetime: resGetWeather.datetime,
                currently : JSON.parse(resGetWeather.currently),
                weekly: JSON.parse(resGetWeather.weekly)
            }
            
            return res.json({
                'status': 'SUCCESS',
                'msg': 'Already Exist, Data Read Successfully',
                'data': data
            });


  
        } else {
            https.get(url, (result) => {
                let data = '';
                
                result.on('data', (chunk) => {
                    data += chunk;
                });

                result.on('end', () => {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.code) {
                        return res.json({
                            'status': 'FAILED',
                            'msg': data,
                     });
                    }
                    let daily = data.daily.data.map((data) => {
                        return {
                            time: data.time,
                            summary: data.summary,
                            icon: data.icon,
                            humidity: data.humidity,
                            temperatureLow: data.temperatureLow
                        }
                    });

                    let newWeather = new weather({
                        latitude: req.body.lat,
                        longitude: req.body.long,
                        city: data.timezone.split('/')[1],
                        datetime: new Date(),
                        currently: JSON.stringify(data.currently),
                        weekly: JSON.stringify(daily)
                    });

                    weather.newWeather(newWeather, (err, ans) => {
                        if (err) {
                               log.write("ERROR", LOGMESSAGE, 'error');
                                 return res.json({
                                'status': 'FAILED',
                                'msg': 'Inserted Failed',
                                'data':''
                            });

                        } else {
                            data = {
                                latitude: ans.latitude,
                                longitude: ans.longitude,
                                city: ans.city,
                                datetime: ans.datetime,
                                currently : JSON.parse(ans.currently),
                                weekly: JSON.parse(ans.weekly)
                            }
                          
                            return res.json({
                                'status': 'SUCCESS',
                                'msg': 'Inserted Successfully',
                                'data': data
                            });

                        }
                    });
                })
            }).on('error', (err) => {
                return res.json({
                    'status': 'FAILED',
                    'msg': err,
                    'data':''
                });

            })
        }
    });

});



let getOutput = (success, message, data) => ({success: success, message: message, data, data});

module.exports = route;
