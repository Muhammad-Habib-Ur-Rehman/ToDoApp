  import React, { useState, useContext } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { ToastContainer } from 'react-toastify';
  import styles from './login.module.css'; // CSS module similar to signup.module.css
  import api from '../../utils/api';
  import { AuthContext } from '../../context/AuthContext';
  import Taskbar from '../../components/Taskbar/Taskbar';
  import Futtor from '../../components/Futtor/Futtor';
  import NoticeBoard from '../../components/Noticeboard/noticeboard';


  const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
  console.log("Trying to login with:", form); 
  const res = await api.post('/auth/login', form);

  const { token, user } = res.data;

  if (token && user) {
    localStorage.setItem('token', token);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    login(token);
    navigate('/dashboard');
  } else {
    setError('Login failed: Missing token or user data');
  }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };



    return (
      <>
        <Taskbar />
        <div className={styles.page}>
          <NoticeBoard />
          <div className={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email..."
                  
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password..."
                />
              </div>
              <button type="submit" className={styles.submitButton}>Login</button>
              {error && <p className={styles.error}>{error}</p>}
              <span className={styles.bottomhead}>
                Don't have an account? <Link to="/signup">Signup</Link>
              </span>
            </form>
            <ToastContainer />
          </div>
        </div>
        <Futtor />
      </>
    );
  };

  export default Login;
