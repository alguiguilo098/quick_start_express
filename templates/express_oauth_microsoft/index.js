import { configDotenv } from 'dotenv'
configDotenv({ path: "./templates/express_oauth_microsoft/.env" })

import express from 'express'
import passport from 'passport'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import jwt from 'jsonwebtoken'

import { loginRouter } from './router/loginRouter.js'
import { userRouter } from './router/userRouter.js'

// For testing
// console.log(process.env.MICROSOFT_CLIENT_ID);
// console.log(process.env.MICROSOFT_CLIENT_SECRET);

passport.use(new MicrosoftStrategy({
    callbackURL: process.env.MICROSOFT_CALLBACK_URL || `http://localhost:3000/auth/microsoft/redirect`,
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    scope: ['openid', 'profile', 'email'],
    // tenant: process.env.MICROSOFT_TENANT_ID // for development
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || 'No email available'
            const name = profile.displayName
            const token = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '1h' }) // generating token
            const redirect_url = `http://localhost:3000/${token}`  // fallback page
            return done(null, redirect_url)
        } catch (error) {
            return done(error)
        }
    }
));

const app = express()

app.use(passport.initialize())

app.use('/auth/microsoft', loginRouter)
app.use('/', userRouter)

app.listen(3000, () => {
    console.log('Serving on port 3000');
})