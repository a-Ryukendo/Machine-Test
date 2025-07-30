import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import listAPI from '../api/list';

function UploadListPage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [distributedLists, setDistributedLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    fetchDistributedLists();
  }, []);

  const fetchDistributedLists = async () => {
    try {
      setLoadingLists(true);
      const data = await listAPI.getDistributedLists();
      setDistributedLists(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch distributed lists');
      console.error('Error fetching lists:', err);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('File selected:', selectedFile);
    
    if (selectedFile) {
      console.log('File type:', selectedFile.type);
      console.log('File name:', selectedFile.name);
      
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        console.log('File type is allowed, setting file');
        setFile(selectedFile);
        setError('');
      } else {
        console.log('File type not allowed:', selectedFile.type);
        setError('Please select a valid file (CSV, XLS, or XLSX)');
        setFile(null);
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      console.log('File object:', file);
      console.log('File name:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size);

      const formData = new FormData();
      formData.append('file', file);

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const result = await listAPI.uploadAndDistribute(formData);
      
      setSuccess(`File uploaded successfully! ${result.totalItemsProcessed} items distributed among ${result.distributedDetails.length} agents.`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Refresh the distributed lists
      fetchDistributedLists();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-list-page">
      <div className="header">
        <h1>Upload & Distribute Lists</h1>
        <p>Upload a CSV or Excel file to distribute tasks among agents</p>
      </div>

      <div className="page-navigation">
        <Link to="/dashboard" className="nav-btn">
          <span className="btn-icon">🏠</span>
          Dashboard
        </Link>
        <Link to="/agents" className="nav-btn">
          <span className="btn-icon">👥</span>
          Manage Agents
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="upload-section">
        <h2>Upload File</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="file-input">Select File (CSV, XLS, XLSX):</label>
            <input
              type="file"
              id="file-input"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              required
            />
            <small>
              File must contain columns: firstname, phone, notes
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload & Distribute'}
            </button>
          </div>
        </form>
      </div>

      <div className="lists-section">
        <h2>Distributed Lists</h2>
        {loadingLists ? (
          <div className="loading">Loading distributed lists...</div>
        ) : distributedLists.length === 0 ? (
          <p>No lists have been distributed yet.</p>
        ) : (
          <div className="lists-grid">
            {distributedLists.map((agentList, index) => (
              <div key={index} className="agent-list-card">
                <div className="agent-header">
                  <h3>{agentList.agent?.name || 'Unknown Agent'}</h3>
                  <span className="item-count">{agentList.items.length} items</span>
                </div>
                
                <div className="agent-details">
                  <p><strong>Email:</strong> {agentList.agent?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {agentList.agent?.phone || 'N/A'}</p>
                </div>

                <div className="items-list">
                  <h4>Assigned Items:</h4>
                  {agentList.items.length === 0 ? (
                    <p>No items assigned</p>
                  ) : (
                    <div className="items-container">
                      {agentList.items.slice(0, 5).map((item, itemIndex) => (
                        <div key={itemIndex} className="item-card">
                          <p><strong>Name:</strong> {item.firstname || 'N/A'}</p>
                          <p><strong>Phone:</strong> {item.phone}</p>
                          <p><strong>Notes:</strong> {item.notes}</p>
                        </div>
                      ))}
                      {agentList.items.length > 5 && (
                        <p className="more-items">
                          ... and {agentList.items.length - 5} more items
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadListPage;
