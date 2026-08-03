import express from 'express';
import { prisma } from "../config/db.js"
const router = express.Router();

const Status = {
  pending: "pending",
  completed: "completed"
}

const Priority = {
  low: "low",
  medium: "medium",
  high: "high"
}

const Category = {
  health: "health",
  work: "work",
  finance: "finance",
  shopping: "shopping",
  personal: "personal",
  other: "other"
}

const SortBy = {
  newestFirst: "nf",
  oldestFirst: "of",
  byDueDate: "dd",
  byPriority: "bp"
}

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    const tasksCount = tasks.length;
    const completed = await prisma.task.findMany(
      {
        where: { status: Status.completed }
      })
    const pendingTasks = await prisma.task.findMany(
      {
        where: { status: Status.pending }
      })

    const highTasks = await prisma.task.findMany(
      {
        where: { priority: Priority.high }
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
  const { search , status , priority , category , sortBy } = req.query;

  try {
    const tasks = await prisma.task.findMany();
    if (search) {
      tasks = tasks.filter(task => task.title.includes(search));
    }
    if (status) {
      tasks = tasks.filter(task => task.status === Status[status]);
    }
    if (priority) {
      tasks = tasks.filter(task => task.priority === Priority[priority]);
    }
    if (category) {
      tasks = tasks.filter(task => task.category === Category[category]);
    }
    if (sortBy && SortBy[sortBy]) {
      tasks = tasks.sort((a, b) => a[SortBy[sortBy]] - b[SortBy[sortBy]]);
    }
    res.json({
      message: 'Tasks fetched successfully',
      tasks: tasks
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
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



router.post('/tasks', async (req, res) => {
  const {
    title,
    status,
    priority,
    category,
    description,
    dueDate } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        status,
        priority,
        category,
        description,
        dueDate
      }
    });
    res.json({
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }

});


router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, category, description, dueDate } = req.body;


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
      message: 'Task Updated successfully',
      task: updatedTask
    });

  } catch (error) {
  
    return res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});


router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;



  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id
      }
    }); 
    if (!task) {
      return res.status(404).json({ error: "task Not Found" });
    }
    await prisma.task.delete({
      where: {
        id: req.params.id
      }
    })
    return res.json({ message: "task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;