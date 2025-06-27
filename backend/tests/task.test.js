const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token;
let taskId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register user
  await request(app).post("/api/auth/register").send({
    name: "Integration User",
    email: "intuser@example.com",
    password: "123456",
  });

  // Login
  const res = await request(app).post("/api/auth/login").send({
    email: "intuser@example.com",
    password: "123456",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("API Integration Tests", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration Task",
        description: "Test integration create",
        dueDate: new Date().toISOString(),
        priority: "Medium",
        tags: "test,api",
        order: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Integration Task");
    taskId = res.body._id;
  });

  it("should get all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get active tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/active")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    res.body.forEach(task => expect(task.completed).toBe(false));
  });

  it("should update the task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        completed: true,
        priority: "High",
        dueDate: new Date().toISOString(),
        tags: "updated,api",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
    expect(res.body.completed).toBe(true);
  });

  it("should get completed tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/completed")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.some(t => t._id === taskId)).toBe(true);
  });

  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Task deleted successfully");
  });
});
