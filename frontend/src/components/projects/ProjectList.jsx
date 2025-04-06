import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/projects/');
        const data = await response.json();
        
        // Flatten the projects from different categories
        const allProjects = [
          ...data.nhai.map(p => ({ ...p, type: 'nhai' })),
          ...data.rsa.map(p => ({ ...p, type: 'rsa' })),
          ...data.xls.map(p => ({ ...p, type: 'xls' }))
        ];

        // Filter by status if provided
        const filteredProjects = status 
          ? allProjects.filter(p => p.status === status)
          : allProjects;

        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [status]);

  const handleProjectClick = (project) => {
    navigate(`/project/${project.type}/${project.id}`);
  };

  return (
    <div className="project-list">
      <h2>Projects {status ? `- ${status.charAt(0).toUpperCase() + status.slice(1)}` : ''}</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Type</th>
              <th>Project ID</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Processing Time</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr 
                key={project.id} 
                onClick={() => handleProjectClick(project)}
                className="project-row"
              >
                <td>{project.name}</td>
                <td>{project.type.toUpperCase()}</td>
                <td>{project.project_id}</td>
                <td>
                  <span className={`badge bg-${project.status === 'completed' ? 'success' : 
                    project.status === 'testing' ? 'primary' : 'danger'}`}>
                    {project.status}
                  </span>
                </td>
                <td>{new Date(project.start_date).toLocaleDateString()}</td>
                <td>{project.processing_time || 'In Progress'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList 