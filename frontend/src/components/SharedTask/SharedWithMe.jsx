import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import TaskCard from "../../components/TaskCard/TaskCard";
import styles from "./SharedWithMe.module.css";
import Sidebar from "../sidebar/sidebar";

const SharedWithMe = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedTasks();
  }, []);

  const fetchSharedTasks = async () => {
    try {
      const res = await api.get("/tasks/shared");
      setTasks(res.data);
      setLoading(false);
      
    } catch (err) {
      console.error("Failed to fetch shared tasks");
      setLoading(false);
    }
  };

  return (
  <div>
    <Sidebar />
    <div className={styles.container}>
        
      <h2>Tasks Shared With Me</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks shared with you yet.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => {}}
              onDelete={() => {}}
              onShare={() => {}}
              onToggle={() => {}}
              disabled
            />
          ))}
        </ul>
      )}
      
    </div>
</div>
  );
};

export default SharedWithMe;
