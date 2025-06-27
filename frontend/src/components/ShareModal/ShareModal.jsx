import React, { useState } from "react";
import styles from "./ShareModal.module.css";

const ShareModal = ({ task, onClose, onShareSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onShareSubmit(task._id, email);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Share Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.actions}>
            <button type="submit">Share</button>
            <button type="button" onClick={onClose} className={styles.cancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
