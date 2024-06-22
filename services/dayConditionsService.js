const DayConditions = require('../models/dayConditions')
const Spot = require('../models/spot')
const { fetchWeatherData, transformDayConditions } = require('./weatherService')

const updateDayConditions = async () => {
    const spots = await Spot.find()
    if (!spots) {
        throw new Error('Spots non trouvé')
    }

    const conditionsData = await Promise.all(
        spots.map(async (spot) => {
            const { marineData, forecastData } = await fetchWeatherData(
                spot.coordinates.latitude,
                spot.coordinates.longitude,
                'hourly'
            )
            return {
                name: spot.name,
                latitude: spot.coordinates.latitude,
                longitude: spot.coordinates.longitude,
                dayConditions: transformDayConditions(marineData, forecastData),
            }
        })
    )

    await DayConditions.deleteMany({})
    await Promise.all(
        conditionsData.map((data) => new DayConditions(data).save())
    )

    return 'Conditions météo du jour enregistrées !'
}

module.exports = {
    updateDayConditions,
}
