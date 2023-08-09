const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')

router.post('/user', UserController.store)
router.get('/user', UserController.get)

module.exports = router