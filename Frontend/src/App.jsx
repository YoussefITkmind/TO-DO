import { useState, useEffect } from "react";
import Header from "./components/Header";
import StatsRow from "./components/StatsRow";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import TaskDetailModal from "./components/TaskDetailModal";
import { apiRequest, apiTaskToUiTask, uiFieldsToApiPayload } from "./api/taskApi";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
  }, [isDark]);

  /* ---------- Raw API-shaped tasks, keyed by id ----------
     TaskDetailModal (Task edit.txt) expects the task straight from the API
     (description / dueDate / status / category / priority / createdAt), not
     the UI-normalized shape used elsewhere (desc / date / completed). Rather
     than touch that component, we just keep both shapes in sync. */
  const [rawTasksById, setRawTasksById] = useState({});

  /* ---------- Load tasks from the API on mount ---------- */
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await apiRequest("/tasks", { method: "GET" });
        if (!cancelled) {
          const rawList = data.tasks || [];
          setTasks(rawList.map(apiTaskToUiTask));
          setRawTasksById(Object.fromEntries(rawList.map(t => [t.id, t])));
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message || "Failed to load tasks.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadTasks();
    return () => { cancelled = true; };
  }, []);

  /* ---------- Add task (POST /tasks) ---------- */
  const [taskDate, setTaskDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskCategory, setTaskCategory] = useState("Select a category");
  const [taskPriority, setTaskPriority] = useState("Select a priority");
  const [isSaving, setIsSaving] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskName("");
    setTaskDesc("");
    setTaskDate("");
    setTaskCategory("Select a category");
    setTaskPriority("Select a priority");
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const payload = uiFieldsToApiPayload({
      title: taskName.trim(),
      desc: taskDesc.trim(),
      date: taskDate,
      category: taskCategory === 'Select a category' ? 'Personal' : taskCategory,
      priority: taskPriority === 'Select a priority' ? 'Low' : taskPriority,
      completed: false
    });

    setIsSaving(true);
    try {
      const data = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setTasks(prev => [apiTaskToUiTask(data.task), ...prev]);
      setRawTasksById(prev => ({ ...prev, [data.task.id]: data.task }));
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to create task.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------- Toggle complete (PUT /tasks/:id) ---------- */

  const toggleTask = async (id) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const nextStatus = nextCompleted ? "completed" : "pending";
    // optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: nextCompleted } : t));
    setRawTasksById(prev => prev[id] ? { ...prev, [id]: { ...prev[id], status: nextStatus } } : prev);

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (err) {
      // revert on failure
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: target.completed } : t));
      setRawTasksById(prev => prev[id] ? { ...prev, [id]: { ...prev[id], status: target.completed ? "completed" : "pending" } } : prev);
      alert(err.message || "Failed to update task.");
    }
  };

  /* ---------- Delete task (DELETE /tasks/:id) ---------- */

  const deleteTask = async (id) => {
    const previousTasks = tasks;
    const previousRaw = rawTasksById;
    setTasks(prev => prev.filter(t => t.id !== id));
    setRawTasksById(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" });
      setSelectedTaskId(current => current === id ? null : current);
    } catch (err) {
      setTasks(previousTasks);
      setRawTasksById(previousRaw);
      alert(err.message || "Failed to delete task.");
    }
  };

  /* ---------- Task detail modal (view / edit / delete a single task) ---------- */
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = selectedTaskId ? rawTasksById[selectedTaskId] : null;

  const handleUpdateTask = async (updatedTask) => {
    const payload = {
      title: updatedTask.title,
      description: updatedTask.description,
      category: updatedTask.category,
      priority: updatedTask.priority,
      status: updatedTask.status
    };
    if (updatedTask.dueDate) {
      // The edit form gives back a plain "YYYY-MM-DD" date; the API wants ISO.
      payload.dueDate = updatedTask.dueDate.length === 10
        ? new Date(updatedTask.dueDate + "T00:00:00").toISOString()
        : updatedTask.dueDate;
    }

    try {
      const data = await apiRequest(`/tasks/${updatedTask.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      const savedRaw = data.task || { ...rawTasksById[updatedTask.id], ...payload };
      setRawTasksById(prev => ({ ...prev, [savedRaw.id]: savedRaw }));
      setTasks(prev => prev.map(t => t.id === savedRaw.id ? apiTaskToUiTask(savedRaw) : t));
    } catch (err) {
      alert(err.message || "Failed to update task.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /* ---------- Derived data ---------- */
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === "High").length;

  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest First");

  let visibleTasks = tasks.filter(t =>
    (!searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === "All Status" || (statusFilter === "Completed" ? t.completed : !t.completed)) &&
    (priorityFilter === "All Priority" || t.priority === priorityFilter) &&
    (categoryFilter === "All Categories" || t.category === categoryFilter)
  );

  if (sortOrder === "Oldest First") {
    visibleTasks = [...visibleTasks].reverse();
  }

  return (
    <div>
      <Header
        currentDate={currentDate}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
      />

      {loadError && (
        <div className="empty-state" style={{ color: '#dc2626', marginBottom: '1rem' }}>
          {loadError}
        </div>
      )}

      <StatsRow
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        highPriorityTasks={highPriorityTasks}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsModalOpen(true)}
      />

      <FilterBar
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        visibleCount={visibleTasks.length}
      />

      <TaskList
        isLoading={isLoading}
        tasks={tasks}
        visibleTasks={visibleTasks}
        formatDate={formatDate}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onSelect={setSelectedTaskId}
      />

      {isModalOpen && (
        <TaskModal
          taskName={taskName}
          onTaskNameChange={setTaskName}
          taskDesc={taskDesc}
          onTaskDescChange={setTaskDesc}
          taskDate={taskDate}
          onTaskDateChange={setTaskDate}
          taskCategory={taskCategory}
          onTaskCategoryChange={setTaskCategory}
          taskPriority={taskPriority}
          onTaskPriorityChange={setTaskPriority}
          isSaving={isSaving}
          onSubmit={handleAddTask}
          onClose={closeModal}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleUpdateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
