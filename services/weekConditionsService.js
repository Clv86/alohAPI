const WeekConditions = require('../models/weekConditions');
const Spot = require('../models/spot');
const { fetchWeatherData, transformWeekConditions } = require('./weatherService');

const updateWeekConditions = async () => {
    const spots = await Spot.find();
    if (!spots) {
        throw new Error('Spots non trouvé');
    }

    const conditionsData = await Promise.all(spots.map(async (spot) => {
        const { marineData, forecastData } = await fetchWeatherData(spot.coordinates.latitude, spot.coordinates.longitude, 'daily');
        return {
            name: spot.name,
            latitude: spot.coordinates.latitude,
            longitude: spot.coordinates.longitude,
            weekConditions: transformWeekConditions(marineData, forecastData),
        };
    }));

    await WeekConditions.deleteMany({});
    await Promise.all(conditionsData.map(data => new WeekConditions(data).save()));

    return 'Conditions météo de la semaine enregistrées !';
};

module.exports = {
    updateWeekConditions,
};
