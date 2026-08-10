import StatCard from './StatCard';

function Statsection({
  totalTasks,
  completedTasks,
  pendingTasks,
  highPriorityTasks
}) {
  return (
    <div className="stat-section">

      <StatCard
        icon="📋"
        title="Total"
        number={totalTasks}
        backgroundColor="#eef2ff"
        iconcolor="#4f46e5"
      />

      <StatCard
        icon="✅"
        title="Completed"
        number={completedTasks}
        backgroundColor="#ecfdf5"
        iconcolor="#10b981"
      />

      <StatCard
        icon="⏳"
        title="Pending"
        number={pendingTasks}
        backgroundColor="#fffbeb"
        iconcolor="#f59e0b"
      />

      <StatCard
        icon="⚠️"
        title="High Priority"
        number={highPriorityTasks}
        backgroundColor="#fef2f2"
        iconcolor="#ef4444"
      />

    </div>
  );
}

export default Statsection;