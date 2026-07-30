import express from 'express';
import { prisma } from "../config/db.js"
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    const tasksCount = tasks.length;
    const completed = await prisma.task.findMany(
      {
        where: { status: "completed" }
      })
    const pendingTasks = await prisma.task.findMany(
      {
        where: { status: "pending" }
      })

    const highTasks = await prisma.task.findMany(
      {
        where: { priority: "high" }
      })
    const pendingCount = pendingTasks.length
    const highCount = highTasks.length

    const completedTasks = completed.length
    console.log(tasksCount)

    res.json({
      message: 'Dashboard fetched successfully',
      tasksCount: tasksCount,
      completed: completedTasks,
      pending: pendingCount,
      highTasks: highCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json({
      message: 'Tasks fetched successfully',
      tasks: tasks
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  const { id } = req.params; // This is a string: "cms7i1ejx0002i8uwn8pflav"

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id // Pass the string directly, do not wrap it in an object
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({
      message: 'Task fetched successfully',
      task: task
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});



router.post('/tasks', (req, res) => {

});






router.put('/tasks/:id', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.delete('/tasks/:id', (req, res) => {

  prisma.tasks.delete({
    where: {
      id: req.params.id
    }
  })
  res.json({ message: 'Hello World!' });
});

export default router;