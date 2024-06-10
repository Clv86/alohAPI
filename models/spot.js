const express = require('express');
const mongoose = require('mongoose');

const spotSchema = mongoose.Schema({
    name: { type:String, required: true},
    coordinates: { 
        latitude: {type:String, required: true},
        longitude: {type:String, required: true}
    }
})

module.exports = mongoose.model('Spot', spotSchema)