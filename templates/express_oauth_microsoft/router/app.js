import express from 'express'

import { authenticateUser } from '../middleware/authenticate.js'

const router = express.Router()

// home page where user info is displayed
router.get('/', authenticateUser, (req, res) => {
    const user = req.user
    const token = req.cookies?.token
    res.send(`Your name is: ${user.name}<br>Your email is: ${user.email}<br>Your token is: ${token}`)
})

export {router as appRouter}
