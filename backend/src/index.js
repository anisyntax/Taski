const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors({ origin: 'http://localhost:5173' })) // Vite's port
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))