function Statcard({ icon, title, number, backgroundColor, iconcolor }) {
  return (
    <div className="stat-card">
      
      <div
        className="stat-icon"
        style={{
          backgroundColor: backgroundColor,
          color: iconcolor
        }}
      >
        {icon}
      </div>

      <div className="stat-title">
        {title} Tasks
      </div>

      <div className="stat-number">
        {number}
      </div>

    </div>
  );
}

export default Statcard;