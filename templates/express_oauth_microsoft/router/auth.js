import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = express.Router()

// token is verified if exists otherwise redirects to microsoft auth
router.get('/login', (req, res) => {
    const token = req.cookies?.token
    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET)
            return res.redirect('/')
        } catch {
            res.clearCookie('token')
        }
    }
    res.redirect('/auth/microsoft/redirect')
})

// microsoft auth occurs here by calling microsoft strategy middleware
router.get('/microsoft/redirect', passport.authenticate('microsoft', { session: false }), (req, res) => {
    if (req.user) {
        const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('token', token, { httpOnly: true }) // use in development
        // res.cookie('token', token, { httpOnly: true, secure: true }) // use in production
        res.redirect('/')
    } else {
        res.status(400).send('Authentication failed.')
    }
})

// handles logout
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

export { router as authRouter}
