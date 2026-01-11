import React from "react";
import logo from "../assets/styles/logo.png"; // Replace with your logo path

export default function Topbar() {
  const styles = {
    topbar: {
      width: "100%",
      height: "120px",
      backgroundColor: "#2a2a45",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between", // logo+name left, logout right
      alignItems: "center",
      padding: "0 20px",
      boxSizing: "border-box",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap", // space between logo and name
    },
    logo: {
      padding: "2px",
      height: "80px",
      width: "80px",
      objectFit: "contain",
      marginTop: "30px",
    },
    companyName: {
      fontSize: "42px",
      marginTop: "30px",
      fontWeight: "bold",
      lineHeight: "1",       // ensures vertical center
    },
    button: {
      backgroundColor: "#ff4d4f",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.2s",
    },
  };

  const handleMouseEnter = (e) => (e.currentTarget.style.backgroundColor = "#ff7875");
  const handleMouseLeave = (e) => (e.currentTarget.style.backgroundColor = "#ff4d4f");

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    window.location.href = "/login";   // redirect
  };

  return (
    <div style={styles.topbar}>
      {/* Left section: logo + company name */}
      <div style={styles.leftSection}>
        <img src={logo} alt="Company Logo" style={styles.logo} />
        <span style={styles.companyName}>CodeThrive Infotech</span>
      </div>

      {/* Logout button */}
      <button
        style={styles.button}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
