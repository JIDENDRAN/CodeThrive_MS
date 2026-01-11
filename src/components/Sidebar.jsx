import { Link } from "react-router-dom";

export default function Sidebar() {
  const styles = {
    sidebar: {
      width: "250px",
      backgroundColor: "#1e1e2f",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    ul: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    li: {},
    link: {
      color: "#fff",
      textDecoration: "none",
      padding: "10px 15px",
      borderRadius: "6px",
      transition: "0.2s",
    },
    linkHover: {
      backgroundColor: "#2a2a45",
    },
  };

  // Handle hover effect
  const handleMouseEnter = (e) => e.currentTarget.style.backgroundColor = "#2a2a45";
  const handleMouseLeave = (e) => e.currentTarget.style.backgroundColor = "transparent";

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.heading}>Admin</h2>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <Link
            to="/projects"
            style={styles.link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Projects
          </Link>
        </li>
        <li style={styles.li}>
          <Link
            to="/projects/new"
            style={styles.link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Create Project
          </Link>
        </li>
        <li style={styles.li}>
          <Link
            to="/payments"
            style={styles.link}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Payments
          </Link>
        </li>
      </ul>
    </aside>
  );
}
