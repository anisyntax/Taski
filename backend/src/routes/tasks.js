const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const prisma = new PrismaClient()

// Protect all task endpoints
router.use(auth)

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  const { title, projectId } = req.body
  
  if (!title || !projectId) {
    return res.status(400).json({ error: 'Title and projectId are required' })
  }

  try {
    // First, verify the project actually belongs to the user trying to add a task
    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId
      }
    })
    res.json(task)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/tasks/:id - Toggle task complete status (PUT also works, using PATCH as standard for partial updates)
router.patch('/:id', async (req, res) => {
  const { done } = req.body
  
  try {
    // Ensure task exists and its parent project belongs to the user
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: true }
    })

    if (!task || task.project.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: { done }
    })
    res.json(updatedTask)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/tasks/:id - duplicate route just in case the frontend used axios.put instead of axios.patch
router.put('/:id', async (req, res) => {
    const { done } = req.body
    
    try {
      const task = await prisma.task.findUnique({
        where: { id: req.params.id },
        include: { project: true }
      })
  
      if (!task || task.project.userId !== req.userId) {
        return res.status(404).json({ error: 'Task not found' })
      }
  
      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { done }
      })
      res.json(updatedTask)
    } catch {
      res.status(500).json({ error: 'Server error' })
    }
  })

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { project: true }
    })

    if (!task || task.project.userId !== req.userId) {
      return res.status(404).json({ error: 'Task not found' })
    }

    await prisma.task.delete({
      where: { id: req.params.id }
    })
    res.json({ message: 'Task deleted successfully' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
