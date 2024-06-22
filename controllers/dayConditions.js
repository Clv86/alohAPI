const DayConditions = require('../models/dayConditions');
const { updateDayConditions } = require('../services/dayConditionsService');
const { handleError } = require('../services/errorService')

exports.deleteAllConditions = async (req, res) => {
    try {
        await DayConditions.deleteMany({});
        res.status(200).send('Données météo effacées !');
    } catch (error) {
        handleError(error, res);
    }
};

exports.getAllConditions = async (req, res) => {
    try {
        const conditions = await DayConditions.find();
        res.status(200).json(conditions);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.getOneCondition = async (req, res) => {
    try {
        const condition = await DayConditions.findOne({ name: req.params.name });
        if (!condition) {
            return res.status(404).json({ error: 'Conditions météo non trouvées' });
        }
        res.status(200).json(condition);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.updateAllConditions = async (req, res) => {
    try {
        const message = await updateDayConditions();
        res.status(200).send(message);
    } catch (error) {
        handleError(error, res);
    }
};
