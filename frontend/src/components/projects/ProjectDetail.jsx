import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${id}/`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <h2>{project.name}</h2>
        <div className="project-meta">
          <span className="project-id">Project ID: {project.project_id}</span>
          <span className={`status-badge ${project.status}`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="project-info">
        <div className="info-card">
          <h3>Project Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Type:</label>
              <span>{project.project_type}</span>
            </div>
            <div className="info-item">
              <label>Start Date:</label>
              <span>{new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Processing Time:</label>
              <span>{project.processing_time || 'In Progress'}</span>
            </div>
            {project.completion_date && (
              <div className="info-item">
                <label>Completion Date:</label>
                <span>{new Date(project.completion_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {project.status === 'failed' && (
          <div className="info-card error-card">
            <h3>Error Information</h3>
            <div className="error-info">
              <div className="info-item">
                <label>Error Type:</label>
                <span>{project.error_type}</span>
              </div>
              <div className="info-item">
                <label>Error Description:</label>
                <p>{project.error_description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 