const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer, token, createdTaskId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await request(app)
    .post("/api/auth/register")
    .send({ name: "Task User", email: "taskuser@example.com", password: "123456" });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "taskuser@example.com", password: "123456" });

  token = loginRes.body.token;
}, 15000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Task Management API", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing creation",
        dueDate: "2025-12-12",
        priority: "High",
        tags: ["test", "api"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Task");
    createdTaskId = res.body._id;
  });

  it("should get all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get active tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/active")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.every(task => task.completed === false)).toBe(true);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        description: "Updated description",
        dueDate: "2025-12-31",
        priority: "Medium",
        tags: "updated,task",
        completed: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  it("should get completed tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/completed")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.every(task => task.completed === true)).toBe(true);
  });

  it("should get tasks by tag", async () => {
    const res = await request(app)
      .get("/api/tasks/tag/updated")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.some(task => task.tags.includes("updated"))).toBe(true);
  });

  it("should share the task with another user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Second User", email: "second@example.com", password: "123456" });

    const res = await request(app)
      .patch(`/api/tasks/share/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ shareWithEmail: "second@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.sharedWith.length).toBeGreaterThan(0);
  });

  it("should fetch shared tasks", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "second@example.com", password: "123456" });

    const secondToken = loginRes.body.token;

    const res = await request(app)
      .get("/api/tasks/shared")
      .set("Authorization", `Bearer ${secondToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Task deleted successfully");
  });
});
