import { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import './App.css';

function App() {
  const API_URL = "https://to-do-black-kappa.vercel.app";

  // Initial tasks
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
  fetch(`${API_URL}/tasks`)
    .then(response => response.json())
    .then(data => {
      setTasks(data.tasks);
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
    });
}, []);

  // Dark mode
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
  }, [isDark]);


  // Selected task for View/Edit
  const [selectedTaskForView, setSelectedTaskForView] = useState(null);


  // Add Task modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskCategory, setTaskCategory] = useState("Personal");
  const [taskPriority, setTaskPriority] = useState("low");


  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");


  // =========================
  // STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    task => task.status !== "completed"
  ).length;

  const highPriorityTasks = tasks.filter(
    task => task.priority === "high"
  ).length;


  // =========================
  // ADD TASK
  // =========================

const handleAddTask = async (e) => {
  e.preventDefault();

  if (!taskName.trim()) {
    return;
  }

  const newTask = {
    title: taskName.trim(),
    status: "pending",
    priority: taskPriority,
    category: taskCategory.toLowerCase(),
    description: taskDescription.trim(),
    dueDate: taskDate || null
  };

  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    setTasks(prevTasks => [data.task, ...prevTasks]);

    closeAddModal();

  } catch (error) {
    console.error("Error adding task:", error);
  }
};



  const closeAddModal = () => {
    setIsAddModalOpen(false);

    setTaskName("");
    setTaskDescription("");
    setTaskDate("");
    setTaskCategory("Personal");
    setTaskPriority("low");
  };


  // =========================
  // DELETE TASK
  // =========================

const handleDeleteTask = async (id) => {

  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      console.error("Failed to delete task");
      return;
    }

    setTasks(prevTasks =>
      prevTasks.filter(task => task.id !== id)
    );

    setSelectedTaskForView(null);

  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

  // =========================
  // UPDATE TASK
  // =========================

 const handleUpdateTask = async (updatedTask) => {

  try {
    const response = await fetch(
      `${API_URL}/tasks/${updatedTask.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: updatedTask.title,
          status: updatedTask.status,
          priority: updatedTask.priority,
          category: updatedTask.category.toLowerCase(),
          description: updatedTask.description,
          dueDate: updatedTask.dueDate || null
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id
          ? data.task
          : task
      )
    );

    setSelectedTaskForView(data.task);

  } catch (error) {
    console.error("Error updating task:", error);
  }
};

  // =========================
  // COMPLETE / UNCOMPLETE
  // =========================

  const handleToggleStatus = async (id) => {

  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const newStatus =
    task.status === "completed"
      ? "pending"
      : "completed";

  try {

    const response = await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? data.task
          : task
      )
    );

  } catch (error) {
    console.error("Error changing task status:", error);
  }
};


  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredTasks = tasks
    .filter(task => {

    const matchesSearch =
  !searchQuery ||
  (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" &&
          task.status === "completed") ||
        (statusFilter === "Not Completed" &&
          task.status !== "completed");


      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;


      const matchesCategory =
        categoryFilter === "All" ||
        task.category === categoryFilter;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    })
    .sort((a, b) => {

      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    });


  return (
    <div className="app-container">

    

      <header className="header">

        <div className="brand">

          <div className="logo-box">
            ✓
          </div>

          <div className="title-taskflow">
            <h1 className="title">
              TaskFlow
            </h1>

            <p className="subtitle">
              Full Stack Todo App
            </p>
          </div>

        </div>


        <div className="header-right">

          <div className="date-badge">
            <div>▣</div>

            <div>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>


          {/* Dark mode button */}

          <button
            className="theme-button"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? "☀" : "☾"}
          </button>

        </div>

      </header>


      {/* =========================
          STATISTICS CARDS
      ========================= */}

      <div className="stats-grid">

        {/* Total */}

        <div className="stat-card">

          <div className="stat-icon total-icon">
            ☷
          </div>

          <div className="stat-title">
            Total Tasks
          </div>

          <div className="stat-number">
            {totalTasks}
          </div>

        </div>


        {/* Completed */}

        <div className="stat-card">

          <div className="stat-icon completed-icon">
            ✓
          </div>

          <div className="stat-title">
            Completed
          </div>

          <div className="stat-number">
            {completedTasks}
          </div>

        </div>


        {/* Pending */}

        <div className="stat-card">

          <div className="stat-icon pending-icon">
            ◷
          </div>

          <div className="stat-title">
            Pending
          </div>

          <div className="stat-number">
            {pendingTasks}
          </div>

        </div>


        {/* High Priority */}

        <div className="stat-card">

          <div className="stat-icon high-icon">
            ⚠
          </div>

          <div className="stat-title">
            High Priority
          </div>

          <div className="stat-number">
            {highPriorityTasks}
          </div>

        </div>

      </div>


      {/* =========================
          SEARCH + FILTER CONTAINER
      ========================= */}

      <div className="controls-container">

        {/* Search */}

        <div className="search-row">

          <div className="search-wrapper">

            <div className="search-icon">
              ⌕
            </div>

            <input
              className="input"
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

          </div>


          <button
            className="add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            + &nbsp; Add Task
          </button>

        </div>


        {/* Filters */}

        <div className="filter-row">

          <div className="filter-icon">
            ☷
          </div>


          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Not Completed">
              Not Completed
            </option>
          </select>


          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">
              All Priority
            </option>

            <option value="high">
              High Priority
            </option>

            <option value="normal">
              Normal Priority
            </option>

            <option value="low">
              Low Priority
            </option>
          </select>


          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
          >
            <option value="All">
              All Categories
            </option>

            <option value="work">
              Work
            </option>

            <option value="personal">
              Personal
            </option>

            <option value="shopping">
              Shopping
            </option>

            <option value="finance">
              Finance
            </option>


            <option value="other">
             Other
            </option>

            
          </select>
          


          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>
          </select>


          <div className="task-count">
            {filteredTasks.length} tasks
          </div>

        </div>

      </div>


      {/* =========================
          TASK LIST
      ========================= */}

      <div className="task-list">

        {filteredTasks.length === 0 ? (

          <div className="empty-state">
            No tasks found.
          </div>

        ) : (

          filteredTasks.map(task => (

            <TaskCard
              key={task.id}
              task={task}

              onToggle={() =>
                handleToggleStatus(task.id)
              }

              onView={() =>
                setSelectedTaskForView(task)
              }

              onUpdate={handleUpdateTask}

              onDelete={() =>
                handleDeleteTask(task.id)
              }
            />

          ))

        )}

      </div>


      {/* =========================
          VIEW / EDIT TASK MODAL
      ========================= */}

      <TaskModal
        key={selectedTaskForView?.id || "empty"}
        task={selectedTaskForView}
        onClose={() =>
          setSelectedTaskForView(null)
        }
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />


      {/* =========================
          ADD TASK MODAL
      ========================= */}

      {isAddModalOpen && (

        <div
          className="add-modal-overlay"
          onClick={(e) => {

            if (
              e.target.classList.contains(
                "add-modal-overlay"
              )
            ) {
              closeAddModal();
            }

          }}
        >

          <div className="add-modal">

            <div className="add-modal-header">

              <h2>
                Add New Task
              </h2>

              <button
                className="close-modal-button"
                onClick={closeAddModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAddTask}
              className="add-form"
            >

              <label>
                Task title
              </label>

              <input
                type="text"
                placeholder="e.g. Finish homework"
                value={taskName}
                onChange={(e) =>
                  setTaskName(e.target.value)
                }
                required
              />


              <label>
                Description
              </label>

              <textarea
                placeholder="Optional details..."
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(e.target.value)
                }
              />


              <label>
                Due date
              </label>

              <input
                type="date"
                value={taskDate}
                onChange={(e) =>
                  setTaskDate(e.target.value)
                }
              />


              <label>
                Category
              </label>

              <select
                value={taskCategory}
                onChange={(e) =>
                  setTaskCategory(e.target.value)
                }
              >
                <option value="work">
                  Work
                </option>

                <option value="personal">
                  Personal
                </option>

                <option value="shopping">
                  Shopping
                </option>

                
                <option value="finance">
                  Finance
                </option>
                
                <option value="health">
                  Health
                </option>

                <option value="other">
                  Other
                </option>

              </select>


              <label>
                Priority
              </label>

              <select
                value={taskPriority}
                onChange={(e) =>
                  setTaskPriority(e.target.value)
                }
              >
                <option value="high">
                  High
                </option>

                <option value="normal">
                  Normal
                </option>

                <option value="low">
                  Low
                </option>
              </select>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                >
                  Add Task
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default App;