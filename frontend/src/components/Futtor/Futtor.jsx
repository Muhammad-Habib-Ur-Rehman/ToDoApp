import React from 'react';
import styles from './futtor.module.css';
import { Link } from 'react-router-dom';

function Futtor() {
    return (
        <div className={styles.futtor}> 
            <div className={styles.imageContainer}>
                <div className={styles.leftImage}>
                    <img src="/images/master-moters.png" alt="Left" />
                </div>
                <div className={styles.rightImage}>
                    <img src="/images/master-moters.png" alt="Right" />
                </div>
            </div>
            <ul className={styles.navRow}>
                <li><Link to='/login'>Home</Link></li>
                <li><Link to='/about'>About</Link></li>
           
            </ul>
            <div className={styles.middleColor}>
                <p>Copyright © 2025 Master Motors All rights reserved</p>
            </div>
        </div>
    );
}

export default Futtor;
