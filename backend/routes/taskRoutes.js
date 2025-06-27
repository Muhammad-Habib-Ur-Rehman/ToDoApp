const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Task = require("../models/Tasks");
const User = require("../models/Users");
const upload = require("../middleware/upload");
const router = express.Router();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

router.get("/active", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId, completed: false });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching active tasks" });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId, completed: true });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching completed tasks" });
  }
});

router.post("/", upload.array("attachments", 5), async (req, res) => {
  try {
    const {
      title, description, dueDate, priority, tags, completed, order, sharedWith
    } = req.body;
    const attachments = req.files?.map(file => file.path) || [];

    let parsedTags = [];
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags.map(t => t.trim()).filter(t => t.length > 0);
    }

    const task = new Task({
      userId: req.userId,
      title,
      description,
      dueDate,
      priority,
      tags: parsedTags,
      completed: completed ?? false,
      order,
      sharedWith,
      attachments,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ message: "Server error creating task", error: err.message });
  }
});




router.put("/:id", upload.array("attachments", 5), async (req, res) => {
  const { id } = req.params;
  console.log("Updating task with ID:", id); // Debugging

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    // Destructure the fields from request body
    const {
      title,
      description,
      dueDate,
      priority,
      tags,
      completed,
      order,
      sharedWith,
    } = req.body;

    // Get new attachments from uploaded files
    const attachments = req.files?.map(file => file.path) || [];
    console.log("Attachments:", attachments);

    // Parse tags safely (handle string or array)
    let parsedTags = [];
    if (typeof tags === "string") {
      parsedTags = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);
    } else if (Array.isArray(tags)) {
      parsedTags = tags.map(t => t.trim()).filter(t => t.length > 0);
    }

    // Prepare update data
    const updateData = {
      title,
      description,
      dueDate,
      priority,
      tags: parsedTags,
      completed: completed ?? false,
      order,
      sharedWith,
    };

    // Merge existing attachments with new ones if present
    if (attachments.length > 0) {
      updateData.attachments = [...(task.attachments || []), ...attachments];
    }

    // Update the task and return the updated object
    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTask);

  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task)
      return res.status(404).json({ message: "Task not found" });

    if (task.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
});



router.get("/tag/:tag", async (req, res) => {
  try {
    const tag = req.params.tag;
    const tasks = await Task.find({ userId: req.userId, tags: tag });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error filtering tasks by tag" });
  }
});

router.patch("/share/:id", async (req, res) => {
  const { id } = req.params;
  const { shareWithEmail } = req.body;

  if (!shareWithEmail)
    return res.status(400).json({ message: "Email is required to share" });

  try {
    const userToShare = await User.findOne({ email: shareWithEmail });
    if (!userToShare)
      return res.status(404).json({ message: "User not found" });

    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task)
      return res.status(404).json({ message: "Task not found or unauthorized" });

    if (task.sharedWith.includes(userToShare._id))
      return res.status(400).json({ message: "Already shared with this user" });

    task.sharedWith.push(userToShare._id);
    await task.save();

    res.json({ message: "Task shared successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error sharing task", error: err.message });
  }
});

router.get('/shared', async (req, res) => {
  try {
    const sharedTasks = await Task.find({ sharedWith: req.userId }).populate("userId", "name email");
    res.json(sharedTasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shared tasks' });
  }
});




module.exports = router;
