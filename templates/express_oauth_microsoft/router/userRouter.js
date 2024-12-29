import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/login', (req, res) => {
    res.send('login page')
})

// router to handle user after redirecting
router.get('/:user', (req, res) => {
    const token = req.query.token;
    if (token) {
        const pl = jwt.verify(token, process.env.JWT_SECRET)
        res.send(`Hey user with token: ${token}`)
    } else {
        res.status(400).send('Token not found.')
    }
})

export { router as userRouter }
