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
        try {
            const pl = jwt.verify(token, process.env.JWT_SECRET)
            res.send(`Hey ${pl.name || 'user'} with token: ${token}`)
        } catch (err) {
            console.log("Token verification error");
            res.send('Invalid token')
        }
    } else {
        res.status(400).send('Token not found.')
    }
})

export { router as userRouter }
