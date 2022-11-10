const express = require('express')
const roleController = require('../controllers/role')

const router = express.Router()

// bot/api/v?/role => POST
router.post('/sync', roleController.sync)
// router.post('/givebwc', roleController.givebwc)
// router.post('/removebwc', roleController.removebwc)
router.post('/give', roleController.give)
router.post('/remove', roleController.remove)

// bot/api/v?/role => GET
router.get('/fetchallroles', roleController.fetchAllRoles)
//router.get('/forcesyncusers', roleController.forceSyncAllUsers)

module.exports = router
