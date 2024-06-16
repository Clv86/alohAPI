const express = require('express')
const mongoose = require('mongoose')

const dayConditionsSchema = mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: String },
    longitude: { type: String },
    dayConditions: [
        {
            time: { type: String, required: true },
            wave_height: { type: Number, required: true },
            wave_direction: { type: Number, required: true },
            wave_period: { type: Number, required: true },
            wind_speed_10m: { type: Number, required: true },
            wind_direction_10m: { type: Number, required: true },
        },
    ],
})

module.exports = mongoose.model('DayConditions', dayConditionsSchema)
