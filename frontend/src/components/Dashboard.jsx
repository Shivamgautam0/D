import React, { useState, useEffect } from 'react';
import ProjectTable from './ProjectTable';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState({
    nhai: [],
    rsa: [],
    xls: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/projects/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data); // For debugging
        setProjects(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>NHAI Testing Report</h1>
      </header>
      
      <div className="dashboard-content">
        <section className="project-section">
          <h2>NHAI Projects</h2>
          <ProjectTable 
            projects={projects.nhai || []}
            type="nhai"
          />
        </section>

        <section className="project-section">
          <h2>RSA Projects</h2>
          <ProjectTable 
            projects={projects.rsa || []}
            type="rsa"
          />
        </section>

        <section className="project-section">
          <h2>XLS Projects</h2>
          <ProjectTable 
            projects={projects.xls || []}
            type="xls"
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 