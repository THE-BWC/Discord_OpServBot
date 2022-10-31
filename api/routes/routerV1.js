const express = require('express')

const router = express.Router()
const roleRouter = require('./roleRouter')
const operationRouter = require('./discordEventRouter')
const channelRouter = require('./channelRouter')
const nicknameRouter = require('./nicknameRouter')

// /bot/api/v1 => Router
router.use('/role', roleRouter)
router.use('/operation', operationRouter)
router.use('/channel', channelRouter)
router.use('/nickname', nicknameRouter)

module.exports = router
