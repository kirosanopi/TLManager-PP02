import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // GET (get all tasks)
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('ошибка загрузки задач');
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('не удалось загрузить задачи: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST (add new task)
  const createTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError('введите название задачи');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle,
          user_id: 1 
        }),
      });

      if (!response.ok) throw new Error('ошибка создания задачи');
      
      const newTask = await response.json();
      setTasks([newTask, ...tasks]); 
      setNewTaskTitle('');
      setError('');
    } catch (err) {
      setError('не удалось создать задачу: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUT (change status task)
  const toggleTaskStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !currentStatus
        }),
      });

      if (!response.ok) throw new Error('ошибка обновления статуса');
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
      setError('');
    } catch (err) {
      setError('не удалось обновить статус: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE (delete task)
  const deleteTask = async (id) => {
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('ошибка удаления задачи');
      
      setTasks(tasks.filter(task => task.id !== id));
      setError('');
    } catch (err) {
      setError('не удалось удалить задачу: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🗁 список задач</h1>
        
        <form onSubmit={createTask} className="task-form">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="введите новую задачу..."
            disabled={loading}
            className="task-input"
          />
          <button type="submit" disabled={loading} className="btn-add">
            {loading ? 'добавление...' : '+ добавить'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="stats">
          <span>всего: {tasks.length}</span>
          <span>выполнено: {tasks.filter(t => t.completed).length}</span>
          <span>активных: {tasks.filter(t => !t.completed).length}</span>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="loading">загрузка...</div>
        ) : (
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>📁 нет задач</p>
                <p>добавьте свою первую задачу!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskStatus(task.id, task.completed)}
                    className="task-checkbox"
                  />
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className="task-id">ID: {task.id}</span>
                      {task.user_id && <span className="task-user">пользователь: {task.user_id}</span>}
                      <span className="task-date">
                        {new Date(task.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;