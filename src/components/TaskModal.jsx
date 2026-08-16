export default function TaskModal({
  taskName,
  onTaskNameChange,
  taskDesc,
  onTaskDescChange,
  taskDate,
  onTaskDateChange,
  taskCategory,
  onTaskCategoryChange,
  taskPriority,
  onTaskPriorityChange,
  isSaving,
  onSubmit,
  onClose
}) {
  return (
    <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={onSubmit}>
          <label htmlFor="taskName">Task title</label>
          <input
            type="text"
            id="taskName"
            placeholder="e.g. Finish homework"
            value={taskName}
            onChange={(e) => onTaskNameChange(e.target.value)}
            required
          />

          <label htmlFor="taskDesc">Description</label>
          <textarea
            id="taskDesc"
            placeholder="Optional details..."
            value={taskDesc}
            onChange={(e) => onTaskDescChange(e.target.value)}
          ></textarea>

          <label htmlFor="taskDate">Due date</label>
          <input
            type="date"
            id="taskDate"
            value={taskDate}
            onChange={(e) => onTaskDateChange(e.target.value)}
          />

          <div className="field-grid">
            <div>
              <label>Category</label>
              <select
                value={taskCategory}
                onChange={(e) => onTaskCategoryChange(e.target.value)}
              >
                <option>Select a category</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Shopping</option>
                <option>Finance</option>
                <option>Health</option>
              </select>
            </div>

            <div>
              <label>Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => onTaskPriorityChange(e.target.value)}
              >
                <option>Select a priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit" disabled={isSaving}>
              {isSaving ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
