import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectTable.css';

const ProjectTable = ({ projects, type }) => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/project/${type}/${projectId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'TESTING':
        return 'status-testing';
      case 'FAILED':
        return 'status-failed';
      default:
        return '';
    }
  };

  if (!projects || projects.length === 0) {
    return <div className="no-projects">No projects available</div>;
  }

  return (
    <div className="project-table">
      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project ID</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Processing Time</th>
            {type === 'failed' && <th>Error Type</th>}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr 
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="project-row"
            >
              <td>{project.name}</td>
              <td>{project.project_id}</td>
              <td>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </td>
              <td>{formatDate(project.testing_start_date)}</td>
              <td>
                {project.testing_completion_date 
                  ? `${Math.round((new Date(project.testing_completion_date) - new Date(project.testing_start_date)) / (1000 * 60 * 60))} hours`
                  : 'In Progress'}
              </td>
              {project.status === 'FAILED' && (
                <td>{project.error_type}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable; 