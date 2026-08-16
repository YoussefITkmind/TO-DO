import Icon from "./Icons";

export default function Header({ currentDate, isDark, onToggleDark }) {
  return (
    <header className="header">
      <div className="logo">{Icon.logo}</div>

      <div className="title-taskflow">
        <h1 className="title">TaskFlow</h1>
        <p className="subtitle">Full Stack Todo App</p>
      </div>

      <div className="space"></div>

      <div className="date-badge">
        {Icon.calendar}
        <span>{currentDate}</span>
      </div>

      <button className="theme-toggle" onClick={onToggleDark} aria-label="Toggle theme">
        {isDark ? Icon.sun : Icon.moon}
      </button>
    </header>
  );
}
