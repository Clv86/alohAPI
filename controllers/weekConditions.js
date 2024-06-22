const WeekConditions = require('../models/weekConditions');
const { updateWeekConditions } = require('../services/weekConditionsService');
const { handleError } = require('../services/errorService')

exports.deleteAllConditions = async (req, res) => {
    try {
        await WeekConditions.deleteMany({});
        res.status(200).send('Weather data deleted successfully!');
    } catch (error) {
        handleError(error, res);
    }
};

exports.getAllConditions = async (req, res) => {
    try {
        const conditions = await WeekConditions.find();
        res.status(200).json(conditions);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.getOneCondition = async (req, res) => {
    try {
        const condition = await WeekConditions.findOne({ name: req.params.name });
        if (!condition) {
            return res.status(404).json({ error: 'Condition not found' });
        }
        res.status(200).json(condition);
    } catch (error) {
        res.status(404).json({ error });
    }
};

exports.updateAllConditions = async (req, res) => {
    try {
        const message = await updateWeekConditions();
        res.status(200).send(message);
    } catch (error) {
        handleError(error, res);
    }
};
