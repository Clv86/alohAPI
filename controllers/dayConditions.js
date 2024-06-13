const axios = require('axios')
const DayConditions = require('../models/dayConditions')
const Spot = require('../models/spot')

const url =
    'https://marine-api.open-meteo.com/v1/marine?latitude=45.0014&longitude=-1.1942&hourly=wave_height,wave_direction,wave_period&forecast_days=1'

exports.updateConditions = (req, res) => {
    axios
        .get(url)
        .then((response) => {
            const data = response.data
            const conditionsArray = data.hourly.time.map((time, index) => ({
                time: data.hourly.time[index],
                wave_height: data.hourly.wave_height[index],
                wave_direction: data.hourly.wave_direction[index],
                wave_period: data.hourly.wave_period[index],
            }))
            return DayConditions.insertMany(conditionsArray)
        })
        .then(() => {
            res.status(200).send('Weather data saved successfully!')
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

exports.updateAllSpot = (req, res) => {
    Spot.find()
        .then((spots) => {
            if (!spots) {
                return res.status(404).send('Spot non trouvé')
            }
            // console.log(spots[0].name)
            const urlPromises = spots.map((spot) => {
                const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin&forecast_days=1`
                const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.coordinates.latitude}&longitude=${spot.coordinates.longitude}&hourly=wind_speed_10m,wind_direction_10m&timezone=Europe%2FBerlin&forecast_days=1`

                return Promise.all([
                    axios.get(marineUrl),
                    axios.get(forecastUrl),
                ]).then((responses) => {
                    const marineData = responses[0].data
                    const forecastData = responses[1].data
                    return {
                        name: spot.name,
                        latitude: spot.coordinates.latitude,
                        longitude: spot.coordinates.longitude,
                        wave_data: marineData.hourly,
                        wind_data: forecastData.hourly,
                    }
                })
            })

            Promise.all(urlPromises).then((allData) => {
                const combinedData = {}

                allData.forEach((data) => {
                    const key = `${data.latitude},${data.longitude}`
                    if (!combinedData[key]) {
                        combinedData[key] = {
                            name: data.name,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            wave_data: data.wave_data,
                            wind_data: data.wind_data,
                        }
                    } else {
                        combinedData[key].wave_data =
                            combinedData[key].wave_data || data.wave_data
                        combinedData[key].wind_data =
                            combinedData[key].wind_data || data.wind_data
                    }
                })

                const result = Object.values(combinedData)
                res.json(result)
            })
            //     .then(data => {
            // const combinedData = [
            //         {
            //           latitude: data[0].latitude,
            //           longitude: data[0].longitude,
            //           time: data[0].hourly.time,
            //           wave_height: data[0].hourly.wave_height,
            //           wave_direction: data[0].hourly.wave_direction,
            //           wave_period: data[0].hourly.wave_period
            //         },
            //         {
            //           latitude: data[1].latitude,
            //           longitude: data[1].longitude,
            //           time: data[1].hourly.time,
            //           wave_height: data[1].hourly.wave_height,
            //           wave_direction: data[1].hourly.wave_direction,
            //           wave_period: data[1].hourly.wave_period
            //         }
            //       ]
            //     });
            // });
            // const urlArray = spot.map(val => {
            //   axios.get(`https://marine-api.open-meteo.com/v1/marine?latitude=${val.coordinates.latitude}&longitude=${val.coordinates.latitude}&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin&forecast_days=1`);
            //   })
            //   return Promise.all(urlArray);
            // return Promise.all(urlPromises);
        })
        // .then(waveHeights => {
        //   // waveHeights contient maintenant un tableau de hauteurs de vagues pour chaque spot
        //   // console.log(waveHeights[0]);
        //   res.json(waveHeights);
        // })
        // const spotName = spot.name
        // const conditions = responses.map(
        //     (response) => response.data
        // )
        // const result = [spotName, conditions]
        // return result
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

exports.addOneCondition = (req, res) => {
    Spot.findById(req.params.id)
        .then((spot) => {
            if (!spot) {
                return res.status(404).send('Spot non trouvé')
            }

            const { latitude, longitude } = spot.coordinates
            return axios.get(
                `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction,wave_period&timezone=Europe%2FBerlin&forecast_days=1`
            )
        })
        .then((response) => {
            const data = response.data
            const conditionsArray = data.hourly.time.map((time, index) => ({
                time: data.hourly.time[index],
                wave_height: data.hourly.wave_height[index],
                wave_direction: data.hourly.wave_direction[index],
                wave_period: data.hourly.wave_period[index],
            }))
            return DayConditions.insertMany(conditionsArray)
        })
        .then(() => {
            res.status(200).send('Weather data saved successfully!')
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

//   const Spot = require('../models/spot');
// const axios = require('axios');

// exports.getDataExterne = (req, res, next) => {
//   Spot.findById(req.params.id)
//     .then(spot => {
//       if (!spot) {
//         return res.status(404).send('Spot non trouvé');
//       }

//       const { latitude, longitude } = spot.coordinates;
//       return axios.get(`https://api.externe.com/data?lat=${latitude}&lon=${longitude}`);
//     })
//     .then(response => {
//       res.json(response.data);
//     })
//     .catch(error => {
//       res.status(500).send(error.message);
//     });
// };

// const Spot = require('../models/spot');
// const axios = require('axios');

// exports.getDataExterne = async (req, res, next) => {
//   try {
//     const spot = await Spot.findById(req.params.id);
//     if (!spot) {
//       return res.status(404).send('Spot non trouvé');
//     }

//     const { latitude, longitude } = spot.coordinates;
//     const response = await axios.get(`https://api.externe.com/data?lat=${latitude}&lon=${longitude}`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
