const express = require('express')
const operationController = require('../controllers/discordEvent')

const router = express.Router()

// bot/api/v?/operation => POST
router.post('/sync', operationController.sync)
router.post('/create', operationController.createEvent)
router.post('/singleUpdate', operationController.updateEvent)
router.post('/multiUpdate', operationController.updateEvents)
router.post('/delete', operationController.delete)

module.exports = router
