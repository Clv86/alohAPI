const express = require('express')
const router = express.Router()
const weekConditionsCtrl = require('../controllers/weekConditions')

router.get('/', weekConditionsCtrl.getAllConditions)
router.get('/:name', weekConditionsCtrl.getOneCondition)
router.post('/', weekConditionsCtrl.updateAllConditions)
router.delete('/', weekConditionsCtrl.deleteAllConditions)

module.exports = router
