const express = require('express')
const router = express.Router()
const dayConditionsCtrl = require('../controllers/dayConditions')

// router.get('/', dayConditionsCtrl.updateConditions);
router.get('/:id', dayConditionsCtrl.addOneCondition)
router.get('/', dayConditionsCtrl.updateAllSpot)

module.exports = router
