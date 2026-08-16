import Icon from "./Icons";

export default function FilterBar({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
  visibleCount
}) {
  return (
    <div className="filter-bar">
      {Icon.sliders}

      <select className="filter-select" value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
        <option>All Status</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>

      <select className="filter-select" value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
        <option>All Priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <select className="filter-select" value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
        <option>All Categories</option>
        <option>Work</option>
        <option>Personal</option>
        <option>Shopping</option>
        <option>Finance</option>
        <option>Health</option>
      </select>

      <select className="filter-select" value={sortOrder} onChange={(e) => onSortChange(e.target.value)}>
        <option>Newest First</option>
        <option>Oldest First</option>
      </select>

      <div className="filter-spacer"></div>
      <div className="filter-count">{visibleCount} task{visibleCount === 1 ? "" : "s"}</div>
    </div>
  );
}
