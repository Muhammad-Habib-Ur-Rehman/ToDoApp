import React from 'react';
import styles from './about.module.css';
import Taskbar from '../../components/Taskbar/Taskbar';
import Futtor from '../../components/Futtor/Futtor';

const About = () => {
  return (
    <div>
      <Taskbar />
      <div className={styles.aboutContainer}>
        <h1 className={styles.title}>About Master Motors</h1>

        <p className={styles.text}>
          Master Motors is a leading name in Pakistan's automotive industry, known for assembling and distributing high-quality commercial and passenger vehicles. As a joint venture with globally recognized brands, Master Motors is committed to delivering excellence in mobility through innovative technology, sustainable practices, and skilled workforce development.
        </p>

        <p className={styles.text}>
          With modern production facilities and a customer-first approach, Master Motors is playing a vital role in shaping Pakistan’s transportation sector. The company aims to drive growth by nurturing young talent, investing in cutting-edge machinery, and forming strategic alliances with world-class automotive brands.
        </p>

        <h2 className={styles.subTitle}>Master Motors Internship Portal</h2>
        <p className={styles.text}>
          This platform serves as a centralized portal for all internship-related activities at Master Motors. It allows students to explore current opportunities, stay informed about announcements, and manage their applications with ease. The goal is to provide a transparent, structured environment for candidates to engage with real-world projects, develop technical skills, and grow professionally.
        </p>

        <p className={styles.text}>
          Master Motors believes in empowering the next generation of engineers, technicians, and managers. Through initiatives like this portal, we aim to bridge the gap between academia and industry, creating a strong pipeline of future-ready professionals who share our passion for innovation and excellence.
        </p>
      </div>
      <Futtor />
    </div>
  );
};

export default About;
