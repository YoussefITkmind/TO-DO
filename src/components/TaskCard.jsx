import Icon from "./Icons";

export default function TaskCard({ task, formatDate, onToggle, onDelete, onSelect }) {
  return (
    <div
      className="task-card"
      onClick={() => onSelect && onSelect(task.id)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <button
        className={`task-checkbox ${task.completed ? 'completed' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </button>

      <div className="task-body">
        <p className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</p>
        {task.desc && <p className="task-desc">{task.desc}</p>}

        <div className="task-meta">
          {task.date && <span className="task-tag">{formatDate(task.date)}</span>}
          <span className="task-tag">{task.category}</span>
          <span className={`task-tag priority-${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      <button className="task-delete" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} aria-label="Delete task">
        {Icon.trash}
      </button>
    </div>
  );
}
