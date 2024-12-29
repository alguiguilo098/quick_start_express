import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/', passport.authenticate('microsoft', { session: false }));

router.get('/redirect', passport.authenticate('microsoft', { session: false, failureRedirect: 'http://localhost:3000/login' }), (req, res) => {
    if (req.user) {
        console.log("REDIRECTING...")
        res.redirect(req.user) // Redirect user with token
    } else {
        res.status(400).send('Authentication failed.')
    }
}
);

export { router as loginRouter }
