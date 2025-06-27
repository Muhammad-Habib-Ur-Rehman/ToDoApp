import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.name) {
      setName(user.name);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false); 
    window.location.replace("/login"); 
  };

  return (
    <>
      <button
        className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        <div></div>
        <div></div>
        <div></div>
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>Dashboard</div>
        {name && <div className={styles.userInfo}> {name}</div>}

        <Link to="/dashboard" className={styles.menuItem}>
          My Tasks
        </Link>

        <Link to="/shared-tasks" className={styles.menuItem}>
          Shared With Me
        </Link>

        <Link to="/Shared-tasks" className={styles.menuItem}>
          Shared Tasks
        </Link>

        <button onClick={handleLogout} className={styles.menuItem}>
          Logout
        </button>
      </aside>

      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
