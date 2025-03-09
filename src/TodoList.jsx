import { useState, useEffect } from "react";

export default function TodoList() {
  // Initialize states
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.className = savedDarkMode ? "dark-mode" : "";
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    document.body.className = newDarkMode ? "dark-mode" : "";
  };

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  // Remove a task
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Toggle completed status
  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // Start editing a task
  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  // Save edited task
  const saveEdit = () => {
    if (editText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[editIndex].text = editText;
    setTasks(newTasks);
    setEditIndex(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditIndex(null);
  };

  // Get filtered tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all" filter
  });

  return (
    <div className="todo-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button 
          className="dark-mode-toggle" 
          onClick={toggleDarkMode}
        >
          {darkMode ? "☀️" : "🌙"} <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        
        <div className="filters">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            All Tasks
          </button>
          <button 
            className={filter === "active" ? "active" : ""} 
            onClick={() => setFilter("active")}
          >
            Active Tasks
          </button>
          <button 
            className={filter === "completed" ? "active" : ""} 
            onClick={() => setFilter("completed")}
          >
            Completed Tasks
          </button>
        </div>
        
        <div className="stats">
          <p>{tasks.filter(t => !t.completed).length} tasks remaining</p>
          <p>{tasks.length} total tasks</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h2>My Tasks</h2>
        </div>
        
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button className="add-btn" onClick={addTask}>Add Task</button>
        </div>
        
        {filteredTasks.length === 0 ? (
          <p className="empty-message">
            {filter === "all" 
              ? "No tasks yet. Add a task to get started!" 
              : filter === "active" 
                ? "No active tasks" 
                : "No completed tasks"}
          </p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((t, index) => (
              <li key={index} className={t.completed ? "completed" : ""}>
                {editIndex === index ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="task-item">
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleComplete(index)}
                      />
                      <span className="task-text">{t.text}</span>
                    </div>
                    <div className="task-actions">
                      <button 
                        className="edit-btn" 
                        onClick={() => startEdit(index)}
                        disabled={t.completed}
                      >
                        ✏️
                      </button>
                      <button className="delete-btn" onClick={() => removeTask(index)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}