const Spot = require('../models/spot');

exports.addSpot = async (req, res, next) => {
    try {
        delete req.body._id;
        if (!req.body.coordinates || !req.body.coordinates.latitude || !req.body.coordinates.longitude) {
            return res.status(400).json({ error: 'Coordonnées invalides' });
        }
        const spot = new Spot({
            name: req.body.name,
            coordinates: {
                latitude: req.body.coordinates.latitude,
                longitude: req.body.coordinates.longitude,
            },
        });

        await spot.save();
        res.status(201).json({ message: 'Spot enregistré !' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getAllSpots = async (req, res, next) => {
    try {
        const spots = await Spot.find();
        res.status(200).json(spots);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getOneSpot = async (req, res, next) => {
    try {
        const spot = await Spot.findOne({ name: req.params.name });
        if (!spot) {
            return res.status(404).json({ error: 'Spot non trouvé' });
        }
        res.status(200).json(spot);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.modifySpot = async (req, res, next) => {
    try {
        await Spot.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id });
        res.status(200).json({ message: 'Spot modifié' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteSpot = async (req, res, next) => {
    try {
        await Spot.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Spot supprimé' });
    } catch (error) {
        res.status(400).json({ error });
    }
};
