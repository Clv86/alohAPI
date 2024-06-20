const express = require('express')
const mongoose = require('mongoose')

const weekConditionsSchema = mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: String },
    longitude: { type: String },
    weekConditions: [
        {
            time: { type: String, required: true },
            wave_height_max: { type: Number, required: true },
            wave_direction_dominant: { type: Number, required: true },
            wave_period_max: { type: Number, required: true },
            wind_speed_10m_max: { type: Number, required: true },
            wind_direction_10m_dominant: { type: Number, required: true },
        },
    ],
})

module.exports = mongoose.model('WeekConditions', weekConditionsSchema)