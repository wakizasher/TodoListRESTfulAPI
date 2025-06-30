import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import { taskAPI } from "./api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskProgress, setNewTaskProgress] = useState("planned");

  // Edit states
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editProgress, setEditProgress] = useState("planned");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      loadTasks();
    } else {
      setLoading(false);
    }
  }, []);

  // Load tasks from API
  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskAPI.getTasks();
      setTasks(tasksData);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    loadTasks();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setTasks([]);
  };

  // Add a new task
  const addTask = async () => {
    if (newTaskTitle.trim() !== "" && newTaskContent.trim() !== "") {
      try {
        const newTask = await taskAPI.createTask({
          title: newTaskTitle,
          content: newTaskContent,
          progress: newTaskProgress,
        });
        setTasks([...tasks, newTask]);
        // Clear form
        setNewTaskTitle("");
        setNewTaskContent("");
        setNewTaskProgress("planned");
        setError("");
      } catch (err) {
        setError("Failed to add task");
        console.error("Error adding task:", err);
      }
    } else {
      setError("Please fill in both title and content");
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task.task_id);
    setEditTitle(task.title);
    setEditContent(task.content);
    setEditProgress(task.progress);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditContent("");
    setEditProgress("planned");
  };

  // Save edited task
  const saveTask = async (taskId) => {
    try {
      const updatedTask = await taskAPI.updateTask(taskId, {
        title: editTitle,
        content: editContent,
        progress: editProgress,
      });
      setTasks(tasks.map((t) => (t.task_id === taskId ? updatedTask : t)));
      setEditingTask(null);
      setError("");
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  // Quick toggle task completion (separate from editing)
  const quickToggleTask = async (task) => {
    try {
      const newProgress = task.progress === "done" ? "planned" : "done";
      const updatedTask = await taskAPI.updateTask(task.task_id, {
        title: task.title,
        content: task.content,
        progress: newProgress,
      });
      setTasks(
        tasks.map((t) => (t.task_id === task.task_id ? updatedTask : t))
      );
      setError("");
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter((task) => task.task_id !== taskId));
        setError("");
      } catch (err) {
        setError("Failed to delete task");
        console.error("Error deleting task:", err);
      }
    }
  };

  // Handle Enter key in inputs
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  // Get status emoji and color
  const getStatusDisplay = (progress) => {
    switch (progress) {
      case "planned":
        return { emoji: "📋", color: "#6c757d", bg: "#f8f9fa" };
      case "in-progress":
        return { emoji: "⏳", color: "#fd7e14", bg: "#fff3cd" };
      case "done":
        return { emoji: "✅", color: "#28a745", bg: "#d4edda" };
      default:
        return { emoji: "📋", color: "#6c757d", bg: "#f8f9fa" };
    }
  };

  // Show login if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Calculate stats
  const completedCount = tasks.filter(
    (task) => task.progress === "done"
  ).length;
  const inProgressCount = tasks.filter(
    (task) => task.progress === "in-progress"
  ).length;
  const plannedCount = tasks.filter(
    (task) => task.progress === "planned"
  ).length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <h1>📋 Your Task Manager</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <div
            style={{
              color: "#dc3545",
              backgroundColor: "#f8d7da",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
              maxWidth: "800px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div>Loading your tasks... ⏳</div>
        ) : (
          <>
            {/* Add new task section */}
            <div style={{ margin: "20px 0", maxWidth: "800px" }}>
              <h3>➕ Add New Task</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                  backgroundColor: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #dee2e6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "600px",
                  }}
                >
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title..."
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      flex: "2",
                    }}
                  />
                  <select
                    value={newTaskProgress}
                    onChange={(e) => setNewTaskProgress(e.target.value)}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      flex: "1",
                    }}
                  >
                    <option value="planned">📋 Planned</option>
                    <option value="in-progress">⏳ In Progress</option>
                    <option value="done">✅ Done</option>
                  </select>
                </div>

                <textarea
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  placeholder="Task description/content..."
                  rows="3"
                  style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                    maxWidth: "600px",
                    resize: "vertical",
                  }}
                />

                <button
                  onClick={addTask}
                  style={{
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Progress section */}
            <div style={{ margin: "20px 0" }}>
              <h3>📊 Progress Overview</h3>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>📋</div>
                  <div>Planned: {plannedCount}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>⏳</div>
                  <div>In Progress: {inProgressCount}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>✅</div>
                  <div>Completed: {completedCount}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px" }}>🎯</div>
                  <div>Total Progress: {progressPercent}%</div>
                </div>
              </div>
            </div>

            {/* Task list */}
            <div style={{ margin: "20px 0", maxWidth: "800px" }}>
              <h3>📌 Your Tasks ({totalCount}):</h3>
              {tasks.length === 0 ? (
                <p style={{ fontStyle: "italic" }}>
                  No tasks yet! Add one above. 👆
                </p>
              ) : (
                <div style={{ textAlign: "left" }}>
                  {tasks.map((task) => {
                    const statusDisplay = getStatusDisplay(task.progress);
                    const isEditing = editingTask === task.task_id;

                    return (
                      <div
                        key={task.task_id}
                        style={{
                          padding: "15px",
                          margin: "10px 0",
                          backgroundColor: statusDisplay.bg,
                          borderRadius: "8px",
                          border: `2px solid ${statusDisplay.color}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {isEditing ? (
                          // Edit mode
                          <div>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{
                                  padding: "8px",
                                  fontSize: "16px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                  flex: "2",
                                }}
                              />
                              <select
                                value={editProgress}
                                onChange={(e) =>
                                  setEditProgress(e.target.value)
                                }
                                style={{
                                  padding: "8px",
                                  fontSize: "16px",
                                  borderRadius: "5px",
                                  border: "1px solid #ccc",
                                  flex: "1",
                                }}
                              >
                                <option value="planned">📋 Planned</option>
                                <option value="in-progress">
                                  ⏳ In Progress
                                </option>
                                <option value="done">✅ Done</option>
                              </select>
                            </div>

                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows="3"
                              style={{
                                padding: "8px",
                                fontSize: "14px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                width: "100%",
                                marginBottom: "10px",
                                resize: "vertical",
                              }}
                            />

                            <div style={{ display: "flex", gap: "5px" }}>
                              <button
                                onClick={() => saveTask(task.task_id)}
                                style={{
                                  padding: "5px 10px",
                                  backgroundColor: "#28a745",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                              >
                                💾 Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                style={{
                                  padding: "5px 10px",
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "10px",
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    margin: "0 0 8px 0",
                                    textDecoration:
                                      task.progress === "done"
                                        ? "line-through"
                                        : "none",
                                    color: statusDisplay.color,
                                  }}
                                >
                                  {statusDisplay.emoji} {task.title}
                                </h4>
                                <p
                                  style={{
                                    margin: "0",
                                    color: "#6c757d",
                                    fontSize: "14px",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {task.content}
                                </p>
                                <small style={{ color: "#6c757d" }}>
                                  Created:{" "}
                                  {new Date(
                                    task.created_at
                                  ).toLocaleDateString()}
                                </small>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "5px",
                                  marginLeft: "15px",
                                }}
                              >
                                <button
                                  onClick={() => quickToggleTask(task)}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor:
                                      task.progress === "done"
                                        ? "#ffc107"
                                        : "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    minWidth: "80px",
                                  }}
                                >
                                  {task.progress === "done"
                                    ? "↶ Undo"
                                    : "✓ Complete"}
                                </button>

                                <button
                                  onClick={() => startEditing(task)}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    minWidth: "80px",
                                  }}
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  onClick={() => deleteTask(task.task_id)}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    minWidth: "80px",
                                  }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Celebration */}
            {completedCount === totalCount && totalCount > 0 && (
              <div style={{ margin: "20px 0" }}>
                <h2 style={{ color: "#FFD700" }}>
                  🎉 Congratulations! All tasks completed! 🎉
                </h2>
              </div>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
