const weatherModel = require('../models/weather');
const axios = require('axios');
require('dotenv').config();

exports.userWeather = async (req, res, next) =>{
    try {       
        

        
        const rawIp =req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const ip = rawIp === '::1' ? "41.203.73.6": rawIp;

        const userAddress = await axios.get(`http://ip-api.com/json/${ip}`)
        const latitude = userAddress.data.lat;
        const longitude = userAddress.data.lon;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_KEY}&units=metric`;
        const actualWeather = await axios.get(apiUrl);
        // console.log(WEATHER_KEY)
        await weatherModel.create({
            lat: latitude,
            long: longitude,
            actualWeather: actualWeather.data,
            userId: req.user._id
        })
        return res.status(200).json({
            message: "Weather data retrieved successfully",
            data: actualWeather.data
        })
    } catch (error) {
        next({
            message: error.message,
            statusCode: 500
        })
    }
}
