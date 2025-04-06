import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState(null);
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roadTypes = ['MCW_LHS', 'MCW_RHS', 'SLL', 'SRR', 'IRR', 'IRL'];

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/projects/${id}/roads/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched project data:', data); // For debugging
        setProjectDetails(data.project);
        setRoads(data.roads);
        setError(null);
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'badge bg-success';
      case 'TESTING':
      case 'IN_PROGRESS':
        return 'badge bg-primary';
      case 'FAILED':
        return 'badge bg-danger';
      case 'PENDING':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  };

  if (loading) {
    return <div className="loading">Loading project details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!projectDetails) {
    return <div className="error-message">Project not found</div>;
  }

  return (
    <div className="project-details">
      <div className="project-header">
        <button className="back-button" onClick={() => navigate('/')}>
          &larr; Back to Dashboard
        </button>
        <h1>{projectDetails.name}</h1>
        <div className="project-meta">
          <span className="project-id">Project ID: {projectDetails.project_id}</span>
          <span className={getStatusBadgeClass(projectDetails.status)}>
            {projectDetails.status}
          </span>
        </div>
      </div>

      <div className="roads-container">
        <h2>Road Testing Status</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Road Type</th>
                <th>Testing Status</th>
                <th>RSA Status</th>
                <th>XLS Status</th>
                <th>Tester</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {roadTypes.map((roadType) => {
                const road = roads.find(r => r.road_type === roadType) || {
                  testing_status: 'PENDING',
                  rsa_status: 'PENDING',
                  xls_status: 'PENDING',
                  tester_assigned: '-',
                  testing_issues: null,
                  rsa_issues: null,
                  xls_issues: null
                };
                
                return (
                  <tr key={roadType}>
                    <td>{roadType.replace('_', ' ')}</td>
                    <td>
                      <span className={getStatusBadgeClass(road.testing_status)}>
                        {road.testing_status}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(road.rsa_status)}>
                        {road.rsa_status}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(road.xls_status)}>
                        {road.xls_status}
                      </span>
                    </td>
                    <td>{road.tester_assigned || '-'}</td>
                    <td>
                      {(road.testing_issues || road.rsa_issues || road.xls_issues) ? (
                        <div className="issues-container">
                          {road.testing_issues && (
                            <div className="issue testing-issue">
                              <strong>Testing:</strong> {road.testing_issues}
                            </div>
                          )}
                          {road.rsa_issues && (
                            <div className="issue rsa-issue">
                              <strong>RSA:</strong> {road.rsa_issues}
                            </div>
                          )}
                          {road.xls_issues && (
                            <div className="issue xls-issue">
                              <strong>XLS:</strong> {road.xls_issues}
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 