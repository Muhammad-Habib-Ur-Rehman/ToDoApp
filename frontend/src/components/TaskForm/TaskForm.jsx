import React, { useState, useEffect } from "react";
import styles from "./TaskForm.module.css";
import api from "../../utils/api";

const TaskForm = ({ fetchTasks, closeForm, task }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    tags: "",
    completed: false,
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "Low",
        tags: task.tags ? task.tags.join(", ") : "",
        completed: task.completed || false,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = new FormData();
  payload.append("title", formData.title);
  payload.append("description", formData.description);
  payload.append("dueDate", formData.dueDate);
  payload.append("priority", formData.priority);
  payload.append("tags", formData.tags);
  payload.append("completed", formData.completed);

  files.forEach((file) => {
    payload.append("attachments", file);
  });

  try {
    if (task) {
      console.log(task._id)
      await api.put(`/tasks/${task._id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/tasks", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    fetchTasks();
    closeForm();
  } catch (error) {
    alert("Error saving task. Please try again.");
    console.error(error);
  }
};


  return (
    <div className={styles.modalOverlay}>
      <form className={styles.modalContent} onSubmit={handleSubmit}>
        <h2>{task ? "Edit Task" : "Add Task"}</h2>

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Priority:
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Tags (comma separated):
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. work, urgent"
          />
        </label>

        <label>
          Attach Files:
          <input
            type="file"
            name="attachments"
            onChange={handleFileChange}
            multiple
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit">{task ? "Update" : "Add"}</button>
          <button type="button" onClick={closeForm} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
