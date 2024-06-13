const express = require('express')
const router = express.Router()
const spotCtrl = require('../controllers/spot')

router.post('/add', spotCtrl.addSpot)
router.get('/', spotCtrl.getAllSpots)
router.get('/:name', spotCtrl.getOneSpot)
router.put('/:id', spotCtrl.modifySpot)
router.delete('/:id', spotCtrl.deleteSpot)

module.exports = router
