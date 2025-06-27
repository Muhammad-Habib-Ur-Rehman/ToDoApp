import React from "react";
import styles from "./TaskCard.module.css";
import { FaEdit, FaTrash, FaShareAlt, FaPaperclip } from "react-icons/fa";

const TaskCard = ({ task, onEdit, onDelete, onShare, onToggle, disabled = false }) => {
  return (
    <li
      className={`${styles.card} ${task.completed ? styles.completed : ""} ${
        !disabled ? styles.withMarkBtn : ""
      }`}
    >
      {!disabled && (
        <button
          onClick={() => onToggle(task)}
          className={styles.markCompleteBtn}
          title={task.completed ? "Mark Incomplete" : "Mark Complete"}
        >
          {task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
      )}

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.title}>{task.title}</span>
          <span className={`${styles.priority} ${styles[task.priority?.toLowerCase()]}`}>
            {task.priority}
          </span>
        </div>

        <p className={styles.description}>{task.description}</p>

        <div className={styles.meta}>
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          <span>Tags: {task.tags?.join(", ") || "None"}</span>
        </div>

        {task.attachments && task.attachments.length > 0 && (
  <div className={styles.attachments}>
    <strong className={styles.attachmentTitle}>
      <FaPaperclip /> Attachments:
    </strong>
    <div className={styles.attachmentList}>
      {task.attachments.map((file, index) => {
        const fileName = file.split("/").pop();
        const ext = fileName.split(".").pop().toLowerCase();

        const iconMap = {
          pdf: "📄",
          doc: "📝",
          docx: "📝",
          jpg: "🖼️",
          jpeg: "🖼️",
          png: "🖼️",
          gif: "🖼️",
          zip: "🗜️",
          default: "📎"
        };

        const icon = iconMap[ext] || iconMap.default;

        return (
          <a
            key={index}
            href={`http://localhost:5000/${file}`}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={styles.attachmentIconOnly}
            title={fileName}
          >
            {icon}
          </a>
        );
      })}
    </div>
  </div>
)}

        {disabled && task.userId && (
          <div className={styles.sharedBy}>
            Shared by: {task.userId.name || task.userId.email}
          </div>
        )}

        {!disabled && (
          <div className={styles.actions}>
            <button onClick={() => onEdit(task)} title="Edit">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(task._id)} title="Delete">
              <FaTrash />
            </button>
            <button onClick={() => onShare(task)} title="Share">
              <FaShareAlt />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TaskCard;
