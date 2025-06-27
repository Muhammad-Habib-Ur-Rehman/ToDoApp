import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import api from "../../utils/api";

import TaskForm from "../../components/TaskForm/TaskForm";
import Sidebar from "../../components/sidebar/sidebar";
import ShareModal from "../../components/ShareModal/ShareModal";
import TaskCard from "../../components/TaskCard/TaskCard";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch {
      alert("Error updating task");
    }
  };

  const openShareModal = (task) => {
    setSelectedTask(task);
    setShowShareModal(true);
  };

  const handleShareSubmit = async (taskId, email) => {
    try {
      await api.patch(`/tasks/share/${taskId}`, { shareWithEmail: email });
      alert("Task shared successfully!");
    } catch {
      alert("Failed to share task.");
    }
    setShowShareModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      alert("Error deleting task");
    }
  };

  const openAddForm = () => {
    setTaskToEdit(null);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setTaskToEdit(task);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTaskToEdit(null);
  };

  const q = searchQuery.toLowerCase().trim();

const filteredTasks = tasks.filter((task) => {
  const matchesStatus =
    filter === "completed" ? task.completed :
    filter === "active" ? !task.completed :
    true;

  const matchesSearch =
    task.title?.toLowerCase().includes(q) ||
    task.description?.toLowerCase().includes(q) ||
    task.tags?.some((tag) => tag.toLowerCase().includes(q));

  return matchesStatus && matchesSearch;
});


  return (
    <div>
      <Sidebar />
      <div className={styles.dashboard}>
        <h2>Your To-Do Dashboard</h2>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search tasks by title, tag or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? styles.activeFilter : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={filter === "active" ? styles.activeFilter : ""}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? styles.activeFilter : ""}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className={styles.taskList}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onShare={openShareModal}
                onToggle={handleToggleComplete}
              />
            ))}
          </ul>
        )}

        {/* Floating Button */}
        <button className={styles.fab} onClick={openAddForm}>
          +
        </button>

        {/* Modals */}
        {showForm && (
          <TaskForm
            fetchTasks={fetchTasks}
            closeForm={closeForm}
            task={taskToEdit}
          />
        )}

        {showShareModal && selectedTask && (
          <ShareModal
            task={selectedTask}
            onClose={() => setShowShareModal(false)}
            onShareSubmit={handleShareSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
