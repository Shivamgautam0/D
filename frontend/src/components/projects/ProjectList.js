// src/components/projects/ProjectList.js
import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getProjects } from '../../services/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { status } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let response;
        if (status) {
          response = await getProjects(status.toLowerCase());
        } else {
          response = await getProjects();
        }
        
        setProjects(response.results || response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [status]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'TESTING':
        return <Badge bg="warning">Under Testing</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      case 'FAILED':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getErrorTypeBadge = (errorType) => {
    if (errorType === 'NONE') return null;
    
    switch (errorType) {
      case 'PROCESSING':
        return <Badge bg="info">Processing Error</Badge>;
      case 'TESTING':
        return <Badge bg="warning">Testing Error</Badge>;
      default:
        return <Badge bg="secondary">{errorType}</Badge>;
    }
  };

  const formatTotalTime = (startDate, endDate) => {
    const start = moment(startDate);
    const end = endDate ? moment(endDate) : moment();
    const duration = moment.duration(end.diff(start));
    
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleRowClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.project_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTitle = () => {
    if (!status) return "All Projects";
    switch (status.toUpperCase()) {
      case 'TESTING': return "Projects Under Testing";
      case 'COMPLETED': return "Completed Projects";
      case 'FAILED': return "Failed Projects";
      default: return `${status} Projects`;
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading projects...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">{getTitle()}</h2>
      
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>Project List</div>
            <div className="w-25">
              <InputGroup>
                <Form.Control
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredProjects.length === 0 ? (
            <p className="text-center">No projects found</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Project ID</th>
                  <th>Processing Date</th>
                  <th>Status</th>
                  <th>Error Type</th>
                  <th>Testing Start Date</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr key={project.id} onClick={() => handleRowClick(project.id)}>
                    <td>{project.name}</td>
                    <td>{project.project_id}</td>
                    <td>{moment(project.processing_completed_date).format('DD-MM-YYYY')}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>{getErrorTypeBadge(project.error_type)}</td>
                    <td>{moment(project.testing_start_date).format('DD-MM-YYYY')}</td>
                    <td>
                      {formatTotalTime(project.testing_start_date, project.testing_completion_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectList;