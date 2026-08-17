import TaskCard from "./TaskCard";

export default function TaskList({ isLoading, tasks, visibleTasks, formatDate, onToggle, onDelete, onSelect }) {
  return (
    <div className="task-list">
      {isLoading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : visibleTasks.length === 0 ? (
        <div className="empty-state">
          {tasks.length === 0 ? "No tasks yet — add one to get started." : "No tasks match your filters."}
        </div>
      ) : (
        visibleTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            formatDate={formatDate}
            onToggle={onToggle}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}
