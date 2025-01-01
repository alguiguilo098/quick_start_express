import jwt from 'jsonwebtoken'

// cookie token authetication
const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        res.status(401).send('Authentication failed. Please log in again.')
    }
}

export { authenticateUser }
