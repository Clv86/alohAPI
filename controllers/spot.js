const Spot = require('../models/spot');

exports.addSpot = (req, res, next) => {
    delete req.body._id;
    const spot = new Spot({
        name : req.body.name,
        coordinates : {
            latitude : req.body.coordinates.latitude,
            longitude : req.body.coordinates.longitude
        }
    });
    spot.save()
        .then(() => res.status(201).json({ message: 'Spot enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};
exports.getAllSpots = (req, res, next) => {
    Spot.find()
        .then((spots) => {
            res.status(200).json(spots);
        }
       ).catch(error => res.status(400).json({ error }));
};
exports.getOneSpot = (req, res, next) => {
    Spot.findOne({
        name: req.params.name
    }).then(
        (spot) => {
        res.status(200).json(spot);
    }).catch(error => res.status(404).json({ error }));
};
exports.modifySpot = (req, res, next) => {
    Spot.updateOne({ _id: req.params.id },  {...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Spot modifié'}))
    .catch(error => res.status(400).json({ error }));
};
exports.deleteSpot = (req, res, next) => {
    Spot.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Spot supprimé'}))
    .catch(error => res.status(400).json({ error }));
};