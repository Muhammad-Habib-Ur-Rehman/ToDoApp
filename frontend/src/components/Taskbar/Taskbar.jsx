import React, { useContext, useEffect, useState } from "react";
import styles from "./taskbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Taskbar() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const storedUserData = localStorage.getItem("loggedInUser");
    try {
      if (storedUserData && storedUserData !== "undefined") {
        const parsedUser = JSON.parse(storedUserData);
        setUserData(parsedUser);
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("loggedInUser");
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/images/master-moters.png" alt="Logo" className={styles.logoImg} />
      </Link>

      {userData && <div className={styles.namebox}>{userData.name}</div>}

      <div className={styles.menuIcon} onClick={toggleMenu}>
        <div className={`${styles.line} ${menuOpen ? styles.activeLine1 : ""}`} />
        <div className={`${styles.line} ${menuOpen ? styles.activeLine2 : ""}`} />
        <div className={`${styles.line} ${menuOpen ? styles.activeLine3 : ""}`} />
      </div>

      <ul className={`${styles.navMenu} ${menuOpen ? styles.navMenuActive : ""}`}>
        {userData ? (
          <>
            <li><Link to="/dashboard" className={styles.link}>Dashboard</Link></li>
            <li><Link to="/about" className={styles.link}>About</Link></li>
            <li><button onClick={handleLogout} className={styles.logoutBtn}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/about" className={styles.link}>About</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Taskbar;
