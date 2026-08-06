import express from 'express';
import { prisma } from "../config/db.js"
const router = express.Router();

const Status = ["pending", "completed"];

const Priority = ["high", "medium", "low"];


const Category = [
  "health",
  "work",
  "finance",
  "shopping",
  "personal",
  "other"
]

router.get('/', async (req, res) => {
  try {
    const tasksCount = await prisma.task.count();

    const completedTasks = await prisma.task.count({
      where: {
        status: "completed"
      }
    });

    const pendingCount = await prisma.task.count({
      where: {
        status: "pending"
      }
    });

    const highCount = await prisma.task.count({
      where: {
        priority: "high"
      }
    });

    res.json({
      success: true,
      message: 'Dashboard fetched successfully',
      tasksCount: tasksCount,
      completed: completedTasks,
      pending: pendingCount,
      highTasks: highCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  const { search, status, priority, category, sortBy } = req.query;
  const prismaConditions = {};

  try {
    if (search) {
      prismaConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      if (!Status.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }
      prismaConditions.status = status;
    }

    if (priority) {
      if (!Priority.includes(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
      }
      prismaConditions.priority = priority;
    }

    if (category) {
      if (!Category.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category value' });
      }
      prismaConditions.category = category;
    }

    let prismaSorting = { createdAt: 'desc' };

    if (sortBy && !['newest', 'oldest', 'dueDate', 'priority'].includes(sortBy)) {
      return res.status(400).json({ success: false, message: 'Invalid sortBy value' });
    }

    if (sortBy === 'oldest') prismaSorting = { createdAt: 'asc' };
    if (sortBy === 'dueDate') prismaSorting = { dueDate: 'asc' };
    if (sortBy === 'priority') prismaSorting = { priority: 'asc' };
    if (sortBy === 'newest') prismaSorting = { createdAt: 'desc' };

    const tasks = await prisma.task.findMany({
      where: prismaConditions,
      orderBy: prismaSorting
    });
    return res.json({
      success: true,
      message: 'Tasks fetched successfully',
      tasks: tasks
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id
      }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.json({
      success: true,
      message: 'Task fetched successfully',
      task: task
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch task', error: error.message });
  }
});



router.post('/tasks', async (req, res) => {
  const {
    title,
    status,
    priority,
    category,
    description,
    dueDate } = req.body;

  try {
    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (status && !Status.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (priority && !Priority.includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority value' });
    }

    if (category && !Category.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category value' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        status,
        priority,
        category,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    });
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {

    return res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }

});


router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, category, description, dueDate } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Task ID is required' });
  }

  if (!title || !dueDate) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (status && !Status.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  if (priority && !Priority.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority value' });
  }

  if (category && !Category.includes(category)) {
    return res.status(400).json({ success: false, message: 'Invalid category value' });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        status,
        priority,
        category,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    });

    return res.json({
      success: true,
      message: 'Task Updated successfully',
      task: updatedTask
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
});


router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;



  try {
    await prisma.task.delete({
      where: {
        id
      }
    })
    return res.json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});


export default router;