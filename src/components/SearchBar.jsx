import Icon from "./Icons";

export default function SearchBar({ searchQuery, onSearchChange, onAddClick }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrap">
        {Icon.search}
        <input
          className="input"
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button className="add-btn" onClick={onAddClick}>
        {Icon.plus} Add Task
      </button>
    </div>
  );
}
