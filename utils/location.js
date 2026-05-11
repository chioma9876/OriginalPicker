const locationModel = require('../models/location');
const axios = require('axios');

exports.userLocation = async (req, res) =>{
    try {       console.log("req user: ", req.user)

        
        const rawIp =req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const ip = rawIp === '::1' ? "41.203.73.6": rawIp;

        const userAddress = await axios.get(`http://ip-api.com/json/${ip}`)
        const latitude = userAddress.data.lat;
        const longitude = userAddress.data.lon;
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        const actualAddress = await axios.get(apiUrl,  {headers: {
            "accept": "application/json",
            "User-Agent": "enogetname(enogetname@gmail.com)"
        }})
        await locationModel.create({
            lat: latitude,
            long: longitude,
            actualAddress: actualAddress.data.display_name,
            userId: req.user.id
        })
        // console.log("actualAddress:", actualAddress);
        res.status(200).json({
            message: 'Location retrieved successfully',
            data: {
                lat: latitude,
                long: longitude,
                actualAddress: actualAddress.data.display_name
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
