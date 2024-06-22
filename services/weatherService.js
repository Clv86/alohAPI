const axios = require('axios')

const fetchMarineData = async (latitude, longitude, timeframe) => {
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&${timeframe}=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin&forecast_days=1`
    const response = await axios.get(marineUrl)
    return response.data[timeframe]
}

const fetchForecastData = async (latitude, longitude, timeframe) => {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&${timeframe}=wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&forecast_days=1`
    const response = await axios.get(forecastUrl)
    return response.data[timeframe]
}

const fetchWeatherData = async (latitude, longitude, timeframe) => {
    const [marineData, forecastData] = await Promise.all([
        fetchMarineData(latitude, longitude, timeframe),
        fetchForecastData(latitude, longitude, timeframe),
    ])

    return { marineData, forecastData }
}

const transformDayConditions = (marineData, forecastData) => {
    return marineData.time
        .map((time, index) => ({
            time,
            wave_height: marineData.wave_height[index],
            wave_direction: marineData.wave_direction[index],
            wave_period: marineData.wave_period[index],
            wind_speed_10m: forecastData.wind_speed_10m[index],
            wind_direction_10m: forecastData.wind_direction_10m[index],
        }))
        .filter((condition) =>
            Object.values(condition).every(
                (value) => value !== null && value !== undefined
            )
        )
}

const transformWeekConditions = (marineData, forecastData) => {
    return marineData.time
        .map((time, index) => ({
            time,
            wave_height_max: marineData.wave_height_max[index],
            wave_direction_dominant: marineData.wave_direction_dominant[index],
            wave_period_max: marineData.wave_period_max[index],
            wind_speed_10m_max: forecastData.wind_speed_10m_max[index],
            wind_direction_10m_dominant:
                forecastData.wind_direction_10m_dominant[index],
        }))
        .filter((condition) =>
            Object.values(condition).every(
                (value) => value !== null && value !== undefined
            )
        )
}

module.exports = {
    fetchWeatherData,
    transformDayConditions,
    transformWeekConditions,
}
