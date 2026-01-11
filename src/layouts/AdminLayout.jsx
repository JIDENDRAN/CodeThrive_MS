import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const styles = {
    adminLayout: { display: "flex", minHeight: "100vh" },
    sidebar: { width: "250px", background: "#1e1e2f", color: "#fff" },
    mainContent: { flex: 1, display: "flex", flexDirection: "column", background: "#f4f5f7" },
    topbar: { height: "60px", background: "#fff", display: "flex", alignItems: "center", padding: "0 20px" },
    content: { padding: "20px", flex: 1, overflowY: "auto" },
  };

  return (
    <div style={styles.adminLayout}>
      <div style={styles.sidebar}>
        <Sidebar />
      </div>
      <div style={styles.mainContent}>
        <div style={styles.topbar}>
          <Topbar />
        </div>
        <div style={styles.content}>
          {/* This is where nested pages render */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
