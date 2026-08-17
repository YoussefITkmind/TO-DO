import Icon from "./Icons";

export default function StatsRow({ totalTasks, completedTasks, pendingTasks, highPriorityTasks }) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-icon indigo">{Icon.list}</div>
        <div className="stat-title">Total Tasks</div>
        <div className="stat-number">{totalTasks}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon green">{Icon.check}</div>
        <div className="stat-title">Completed</div>
        <div className="stat-number">{completedTasks}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon amber">{Icon.clock}</div>
        <div className="stat-title">Pending</div>
        <div className="stat-number">{pendingTasks}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon red">{Icon.alert}</div>
        <div className="stat-title">High Priority</div>
        <div className="stat-number">{highPriorityTasks}</div>
      </div>
    </div>
  );
}
