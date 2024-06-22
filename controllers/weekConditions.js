const axios = require('axios')
const WeekConditions = require('../models/weekConditions')
const Spot = require('../models/spot')
const { handleError } = require('../services/errorService')


exports.deleteAllConditions = (req, res) => {
    WeekConditions.deleteMany({})
        .then(() => {
            res.status(200).send('Weather data deleted successfully!')
        })
        .catch((error) => handleError(error, res))
}
exports.getAllConditions = (req, res) => {
    WeekConditions.find()
        .then((spots) => {
            res.status(200).json(spots)
        })
        .catch((error) => res.status(404).json({ error }))
}
exports.getOneCondition = (req, res) => {
    WeekConditions.findOne({
        name: req.params.name,
    })
        .then((spot) => {
            res.status(200).json(spot)
        })
        .catch((error) => res.status(404).json({ error }))
}
exports.updateAllConditions = (req, res) => {
    WeekConditions.deleteMany({})
    Spot.find().then((spots) => {
        if (!spots) {
            return res.status(404).send('Spot non trouvé')
        }
        const urlPromises = spots.map((spot) => {
            const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=Europe%2FBerlin`
            const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&daily=wind_speed_10m_max,wind_direction_10m_dominant&timezone=Europe%2FBerlin`
            return Promise.all([
                axios.get(marineUrl),
                axios.get(forecastUrl),
            ]).then((responses) => {
                const marineData = responses[0].data.daily
                const forecastData = responses[1].data.daily

                const weekConditions = marineData.time
                    .map((time, index) => {
                        const waveHeight = marineData.wave_height_max[index]
                        const waveDirection =
                            marineData.wave_direction_dominant[index]
                        const wavePeriod = marineData.wave_period_max[index]
                        const windSpeed10m =
                            forecastData.wind_speed_10m_max[index]
                        const windDirection10m =
                            forecastData.wind_direction_10m_dominant[index]

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
                                wave_height_max: waveHeight,
                                wave_direction_dominant: waveDirection,
                                wave_period_max: wavePeriod,
                                wind_speed_10m_max: windSpeed10m,
                                wind_direction_10m_dominant: windDirection10m,
                            }
                        }

                        return null
                    })
                    .filter((condition) => condition !== null)
                return {
                    name: spot.name,
                    latitude: spot.coordinates.latitude,
                    longitude: spot.coordinates.longitude,
                    weekConditions,
                }
            })
        })

        return Promise.all(urlPromises)
            .then((allData) => {
                const combinedDataPromises = allData.map((data) => {
                    const weekCondition = new WeekConditions(data)
                    return weekCondition.save()
                })

                return Promise.all(combinedDataPromises).then(() => allData)
            })
            .then((allData) => {
                res.json('Weather data saved successfully!')
            })
            .catch((error) => handleError(error, res))

    })
}
