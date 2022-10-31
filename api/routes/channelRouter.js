const express = require('express')
const channelController = require('../controllers/channel')

const router = express.Router()

// bot/api/v?/channel => GET
router.get('/getAllVoiceChannels', channelController.getAllVoiceChannels)

module.exports = router
