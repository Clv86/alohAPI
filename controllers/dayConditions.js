const axios = require('axios')
const DayConditions = require('../models/dayConditions')
const Spot = require('../models/spot')

exports.deleteAllConditions = (req, res) => {
    DayConditions.deleteMany({})
        .then(() => {
            res.status(200).send('Weather data deleted successfully!')
        })
        .catch((error) => {
            if (error.response) {
                console.error(`HTTP error: ${error.response.status}`)
            } else if (error.request) {
                console.error('Request error: No response received')
            } else {
                console.error('Error:', error.message)
            }
        })
}
exports.getAllConditions = (req, res) => {
    DayConditions.find()
        .then((spots) => {
            res.status(200).json(spots)
        })
        .catch((error) => res.status(404).json({ error }))
}
exports.getOneCondition = (req, res) => {
    DayConditions.findOne({
        name: req.params.name,
    })
        .then((spot) => {
            res.status(200).json(spot)
        })
        .catch((error) => res.status(404).json({ error }))
}
exports.updateAllConditions = (req, res) => {
    DayConditions.deleteMany({})
    Spot.find().then((spots) => {
        if (!spots) {
            return res.status(404).send('Spot non trouvé')
        }
        const urlPromises = spots.map((spot) => {
            const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin&forecast_days=1`
            const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&hourly=wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&forecast_days=1`
            return Promise.all([
                axios.get(marineUrl),
                axios.get(forecastUrl),
            ]).then((responses) => {
                const marineData = responses[0].data.hourly
                const forecastData = responses[1].data.hourly

                const dayConditions = marineData.time
                    .map((time, index) => {
                        const waveHeight = marineData.wave_height[index]
                        const waveDirection = marineData.wave_direction[index]
                        const wavePeriod = marineData.wave_period[index]
                        const windSpeed10m = forecastData.wind_speed_10m[index]
                        const windDirection10m =
                            forecastData.wind_direction_10m[index]

                        if (
                            waveHeight !== null &&
                            waveHeight !== undefined &&
                            waveDirection !== null &&
                            waveDirection !== undefined &&
                            wavePeriod !== null &&
                            wavePeriod !== undefined &&
                            windSpeed10m !== null &&
                            windSpeed10m !== undefined &&
                            windDirection10m !== null &&
                            windDirection10m !== undefined
                        ) {
                            return {
                                time,
                                wave_height: waveHeight,
                                wave_direction: waveDirection,
                                wave_period: wavePeriod,
                                wind_speed_10m: windSpeed10m,
                                wind_direction_10m: windDirection10m,
                            }
                        }

                        return null
                    })
                    .filter((condition) => condition !== null)
                return {
                    name: spot.name,
                    latitude: spot.coordinates.latitude,
                    longitude: spot.coordinates.longitude,
                    dayConditions,
                }
            })
        })

        return Promise.all(urlPromises)
            .then((allData) => {
                const combinedDataPromises = allData.map((data) => {
                    const dayCondition = new DayConditions(data)
                    return dayCondition.save()
                })

                return Promise.all(combinedDataPromises).then(() => allData)
            })
            .then((allData) => {
                res.json('Weather data saved successfully!')
            })
            .catch((error) => {
                if (error.response) {
                    console.error(`HTTP error: ${error.response.status}`)
                } else if (error.request) {
                    console.error('Request error: No response received')
                } else {
                    console.error('Error:', error.message)
                }
            })
    })
}
