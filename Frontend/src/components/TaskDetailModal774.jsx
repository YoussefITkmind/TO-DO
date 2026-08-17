import { useState } from 'react';

function TaskModal({ task, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // State for tracking all editable fields
  const [editedTitle, setEditedTitle] = useState(task?.title || "");
  const [editedDescription, setEditedDescription] = useState(task?.description || "");
  const [editedCategory, setEditedCategory] = useState(task?.category || "General");
  const [editedPriority, setEditedPriority] = useState(task?.priority || "normal");
  const [editedDueDate, setEditedDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : "");
  const [editedStatus, setEditedStatus] = useState(task?.status || "pending");

  if (!task) return null;

  const handleSaveModalEdit = () => {
    if (!editedTitle.trim()) return;
    onUpdate({ 
      ...task, 
      title: editedTitle, 
      description: editedDescription,
      category: editedCategory,
      priority: editedPriority,
      dueDate: editedDueDate,
      status: editedStatus
    });
    setIsEditing(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '30px',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 10px', borderRadius: '8px', fontSize: '16px' }}>💾</div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#111827', fontWeight: '600' }}>
              {isEditing ? 'Edit Task' : 'Task Details'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
        </div>

        {/* Conditional View: Full Edit Form vs Standard Details View */}
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Task Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Task Title <span style={{ color: '#dc2626' }}>*</span></label>
              <input 
                type="text" 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                style={{ padding: '10px', fontSize: '15px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%' }}
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Description</label>
              <textarea 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)}
                style={{ padding: '10px', fontSize: '14px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', resize: 'vertical', minHeight: '80px', outline: 'none' }}
              />
            </div>

            {/* Category & Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Category</label>
                <select 
                  value={editedCategory} 
                  onChange={(e) => setEditedCategory(e.target.value)}
                  style={{ padding: '10px', fontSize: '14px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', textTransform: 'capitalize' }}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="shopping">Shopping</option>
                  <option value="finance">Finance</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Priority</label>
                <select 
                  value={editedPriority} 
                  onChange={(e) => setEditedPriority(e.target.value)}
                  style={{ padding: '10px', fontSize: '14px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', textTransform: 'capitalize' }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date & Status Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Due Date <span style={{ color: '#dc2626' }}>*</span></label>
                <input 
                  type="date" 
                  value={editedDueDate} 
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  style={{ padding: '10px', fontSize: '14px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</label>
                <select 
                  value={editedStatus} 
                  onChange={(e) => setEditedStatus(e.target.value)}
                  style={{ padding: '10px', fontSize: '14px', color: '#1f2937', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', textTransform: 'capitalize' }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Edit Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={handleSaveModalEdit}
                style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
              >
                💾 Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

          </div>
        ) : (
          <>
            {/* Title Display */}
            <div>
              <h2 style={{ margin: 0, fontSize: '22px', color: '#1f2937', fontWeight: '700', textDecoration: task.status === "completed" ? 'line-through' : 'none' }}>
                {task.title}
              </h2>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>🏷️ {task.category}</div>
              <div style={{ background: '#fffbeb', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>🚩 {task.priority} Priority</div>
              <div style={{ background: task.status === 'completed' ? '#ecfdf5' : '#f3f4f6', color: task.status === 'completed' ? '#10b981' : '#4b5563', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', textTransform: 'capitalize' }}>{task.status}</div>
            </div>

            {/* Description Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.05em' }}>DESCRIPTION</div>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '15px', lineHeight: '1.5' }}>{task.description}</p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '5px 0' }} />

            {/* Dates */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '2px' }}>DUE DATE</div>
                <div>📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '2px' }}>CREATED</div>
                <div>🕒 {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>

            {/* Bottom Panel: Delete Confirmation or Main Actions */}
            {showDeleteConfirm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fef2f2', padding: '15px', borderRadius: '12px', border: '1px solid #fecaca', marginTop: '10px' }}>
                <div style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px' }}>
                  ⚠️ Are you sure you want to delete this task? This cannot be undone.
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onDelete(task.id)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setShowDeleteConfirm(false);
                  }}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Edit Task
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setIsEditing(false);
                  }}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Task
                </button>
                <button 
                  onClick={onClose}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default TaskModal;