const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: [true, "Title is required"] },
  description: { type: String, required: [true, "Description is required"] },
  dueDate: { type: Date, required: [true, "Due date is required"] },
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    required: [true, "Priority is required"]
  },
  tags: [{ type: String }],
  completed: { type: Boolean, default: false },
  order: { type: Number },
  attachments: [{ type: String }],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Task", taskSchema);
