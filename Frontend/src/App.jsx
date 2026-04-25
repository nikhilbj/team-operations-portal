import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://team-operations-portal-production.up.railway.app";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "",
  });

  const fetchTasks = () => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const saveTask = () => {
    const url = editId ? `${API_URL}/tasks/${editId}` : `${API_URL}/tasks`;

    fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }).then(() => {
      fetchTasks();
      resetForm();
    });
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    }).then(() => fetchTasks());
  };

  const editTask = (task) => {
    setEditId(task.id);
    setNewTask(task);
  };

  const resetForm = () => {
    setEditId(null);
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      status: "",
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Team Operations Portal</h1>
        <p>Manage tasks, ownership, and status updates in one place.</p>
      </header>

      <div className="layout">
        <section className="card form-card">
          <h2>{editId ? "Edit Task" : "Create Task"}</h2>

          <input
            name="title"
            placeholder="Task title"
            value={newTask.title}
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={handleChange}
          />

          <input
            name="assignedTo"
            placeholder="Assigned to"
            value={newTask.assignedTo}
            onChange={handleChange}
          />

          <select name="status" value={newTask.status} onChange={handleChange}>
            <option value="">Select status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>

          <div className="button-row">
            <button className="primary-btn" onClick={saveTask}>
              {editId ? "Update Task" : "Add Task"}
            </button>

            {editId && (
              <button className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </section>

        <section className="card table-card">
          <h2>Task List</h2>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    <span className="status-pill">{task.status}</span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => editTask(task)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No tasks yet. Create your first task.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default App;