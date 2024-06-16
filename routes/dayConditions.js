const express = require('express')
const router = express.Router()
const dayConditionsCtrl = require('../controllers/dayConditions')

router.get('/', dayConditionsCtrl.getAllConditions)
router.post('/:id', dayConditionsCtrl.addOneCondition)
router.post('/', dayConditionsCtrl.updateAllConditions)
router.delete('/', dayConditionsCtrl.deleteAllConditions)

module.exports = router
