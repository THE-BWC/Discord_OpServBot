const express = require('express')
const nicknameController = require('../controllers/nickname')

const router = express.Router()

// bot/api/v?/nickname => POST
router.post('/set', nicknameController.set)

module.exports = router
