const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const prisma = new PrismaClient()

// All project routes require authentication
router.use(auth)

// GET /api/projects (Get all projects for the logged-in user)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { tasks: true } // including tasks so the frontend can display task counts etc.
    })
    res.json(projects)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/projects (Create a new project)
router.post('/', async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Project name is required' })

  try {
    const project = await prisma.project.create({
      data: {
        name,
        userId: req.userId
      }
    })
    res.json(project)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/projects/:id (Delete a project)
router.delete('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    })
    
    // Ensure the project belongs to the user trying to delete it
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found' })
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    })
    res.json({ message: 'Project deleted successfully' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
