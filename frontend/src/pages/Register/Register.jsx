import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import styles from "../Login/login.module.css"; // Adjust if needed
import Taskbar from "../../components/Taskbar/Taskbar";
import Futtor from "../../components/Futtor/Futtor";
import NoticeBoard from "../../components/Noticeboard/noticeboard";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.retypePassword) {
      return setError("Passwords do not match");
    }

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Taskbar />
      <div className={styles.page}>
        <NoticeBoard />
        <div className={styles.container}>
          <h1>Create an Account</h1>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={error.includes("name") ? styles.inputError : ""}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={error.includes("email") ? styles.inputError : ""}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={error.includes("password") ? styles.inputError : ""}
            />
            <input
              name="retypePassword"
              type="password"
              placeholder="Retype Password"
              value={form.retypePassword}
              onChange={handleChange}
              className={
                error.includes("match") ? styles.inputError : ""
              }
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitButton}>Register</button>
            <span className={styles.bottomhead}>
              Already have an account? <a href="/login">Login</a>
            </span>
          </form>
        </div>
      </div>
      <Futtor />
    </>
  );
};

export default Register;
