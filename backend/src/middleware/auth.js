const jwt = require('jsonwebtoken')
module.exports = function authMiddleware(req, res, next) {
 const token = req.headers.authorization?.split(' ')[1] // "Bearer TOKEN"
 if (!token)
 return res.status(401).json({ error: 'Please log in' })
 try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET)
 req.userId = decoded.userId // now every route knows who is calling
 next()
 } catch {
 res.status(401).json({ error: 'Invalid or expired token' })
 }
}
