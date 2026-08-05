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
  newestFirst: "newest",
  oldestFirst: "oldest",
  byDueDate: "dueDate",
  byPriority: "priority"
}

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
  console.log("Search Query:", req.query);
  try {
    const tasks = await prisma.task.findMany();

    let filteredTasks = tasks;
    if (search) {
      filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase())
        || task.description.toLowerCase().includes(search.toLowerCase()));
    }

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === Status[status]);
    }
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === Priority[priority]);
    }
    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === Category[category]);
    }
    if (sortBy) {
      switch (sortBy) {
        case SortBy.newestFirst:
          filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case SortBy.oldestFirst:
          filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case SortBy.byDueDate:
          filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          break;
        case SortBy.byPriority:
          filteredTasks.sort((a, b) => {
            const priorityOrder = [Priority.high, Priority.medium, Priority.low];
            return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
          });
          break;
      }
    }
    res.json({
      success: true,
      message: 'Tasks fetched successfully',
      tasks: filteredTasks
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

    if (status && !Object.values(Status).includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (priority && !Object.values(Priority).includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority value' });
    }

    if (category && !Object.values(Category).includes(category)) {
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
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
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
      success: true,
      message: 'Task Updated successfully',
      task: updatedTask
    });

  } catch (error) {

    return res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
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
      return res.status(404).json({ success: false, message: "task Not Found" });
    }
    await prisma.task.delete({
      where: {
        id: req.params.id
      }
    })
    return res.json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});


export default router;