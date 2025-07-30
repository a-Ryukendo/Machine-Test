import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import agentAPI from '../api/agent';

function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentAPI.getAgents();
      setAgents(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agentAPI.createAgent(formData);
      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      fetchAgents();
      setError('');
    } catch (err) {
      setError('Failed to create agent');
      console.error('Error creating agent:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentAPI.deleteAgent(id);
        fetchAgents();
        setError('');
      } catch (err) {
        setError('Failed to delete agent');
        console.error('Error deleting agent:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div className="agents-page">
      <div className="header">
        <h1>Agent Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Agent'}
          </button>
        </div>
      </div>

      <div className="page-navigation">
        <Link to="/dashboard" className="nav-btn">
          <span className="btn-icon">🏠</span>
          Dashboard
        </Link>
        <Link to="/upload-list" className="nav-btn">
          <span className="btn-icon">📤</span>
          Upload Lists
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Add New Agent</h2>
          <form onSubmit={handleSubmit} className="agent-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (with country code):</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Create Agent
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="agents-list">
        <h2>Registered Agents ({agents.length})</h2>
        {agents.length === 0 ? (
          <p>No agents registered yet.</p>
        ) : (
          <div className="agents-grid">
            {agents.map((agent) => (
              <div key={agent._id} className="agent-card">
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p><strong>Email:</strong> {agent.email}</p>
                  <p><strong>Phone:</strong> {agent.phone}</p>
                  <p><strong>Created:</strong> {new Date(agent.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="agent-actions">
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(agent._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentsPage;
