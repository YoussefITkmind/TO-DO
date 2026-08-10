import { useState } from 'react';
import './TaskCard.css';

// Helper function to format any date string/object to YYYY-MM-DD in UTC
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toISOString().split('T')[0];
};

function TaskCard({ task, onToggle, onView, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const isCompleted = task.status === "completed";

  const handleSaveEdit = () => {
    if (!editedTitle.trim()) return;
    onUpdate({ ...task, title: editedTitle });
    setIsEditing(false);
  };

  return (
    <div className="task">
      <div className="task-top">
        <input 
          type="checkbox" 
          checked={isCompleted} 
          onChange={onToggle} 
        />
        <div className={`task-info ${isCompleted ? 'completed-task' : ''}`}>
          {isEditing ? (
            <input 
              type="text" 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '15px', borderRadius: '4px', border: '1px solid #3b82f6', width: '100%' }}
            />
          ) : (
            <h2>{task.title}</h2>
          )}
          <p>{task.description}</p>

          {/* Badges Row (Category, Priority, Status) */}
          <div className="task-badges" style={{ display: 'flex', gap: '8px', margin: '8px 0', alignItems: 'center', flexWrap: 'wrap' }}>
            {task.category && (
              <div className="badge-category" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' }}>
                {task.category}
              </div>
            )}
            {task.priority && (
              <div className="badge-priority" style={{ background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' }}>
                • {task.priority}
              </div>
            )}
            {task.status && (
              <div className="badge-status" style={{ background: '#fef9c3', color: '#a16207', padding: '2px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' }}>
                {task.status}
              </div>
            )}
          </div>

          {/* Dates Row (Due Date / Overdue & Created Date) */}
          <div className="task-dates" style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280', marginTop: '6px' }}>
            {task.dueDate && (
              <span style={{ color: task.isOverdue ? '#ef4444' : '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📅 {task.isOverdue ? `Overdue · ${formatDate(task.dueDate)}` : `Due · ${formatDate(task.dueDate)}`}
              </span>
            )}
            {task.createdAt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                🕒 Created {formatDate(task.createdAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="buttons">
        <button className="button-view" onClick={onView}>View</button>
        {isEditing ? (
          <button className="button-edit" onClick={handleSaveEdit} style={{ background: '#22c55e', color: '#fff', border: 'none' }}>Save</button>
        ) : (
          <button className="button-edit" onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button className="button-delete" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;