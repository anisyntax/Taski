const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// POST /api/auth/register
router.post('/register', async (req, res) => {
 const { name, email, password } = req.body
 try {
 const exists = await prisma.user.findUnique({ where: { email } })
 if (exists) return res.status(400).json({ error: 'Email already used' })
 const hashed = await bcrypt.hash(password, 10) // never store plain text!
 const user = await prisma.user.create({
 data: { name, email, password: hashed }
 })
 const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
 res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
 } catch { res.status(500).json({ error: 'Server error' }) }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
 const { email, password } = req.body
 try {
 const user = await prisma.user.findUnique({ where: { email } })
 if (!user) return res.status(400).json({ error: 'No account with that email' })
 const valid = await bcrypt.compare(password, user.password)
 if (!valid) return res.status(400).json({ error: 'Wrong password' })
 const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
 res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
 } catch { res.status(500).json({ error: 'Server error' }) }
})

module.exports = router
