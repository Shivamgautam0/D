// src/components/projects/ProjectDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Table, Nav, Tab } from 'react-bootstrap';
import moment from 'moment';
import { getProjectById, getProjectRoads } from '../../services/api';

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData);
        
        const roadsData = await getProjectRoads(id);
        setRoads(roadsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project details:", error);
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'TESTING':
        return <Badge bg="warning">Under Testing</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      case 'FAILED':
        return <Badge bg="danger">Failed</Badge>;
      case 'PENDING':
        return <Badge bg="info">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge bg="primary">In Progress</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('DD-MM-YYYY HH:mm') : 'N/A';
  };

  const formatTotalTime = (startDate, endDate) => {
    if (!startDate) return 'N/A';
    
    const start = moment(startDate);
    const end = endDate ? moment(endDate) : moment();
    const duration = moment.duration(end.diff(start));
    
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const sortRoadsByType = (roads) => {
    const roadTypeOrder = {
      'MCW_LHS': 1,
      'MCW_RHS': 2,
      'SLL': 3,
      'SRR': 4,
      'IRR': 5,
      'IRL': 6
    };
    
    return [...roads].sort((a, b) => roadTypeOrder[a.road_type] - roadTypeOrder[b.road_type]);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading project details...</div>;
  }

  if (!project) {
    return <div className="alert alert-danger">Project not found</div>;
  }

  const sortedRoads = sortRoadsByType(roads);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Details</h2>
        <Link to="/projects" className="btn btn-outline-primary">Back to Projects</Link>
      </div>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>Project Information</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Project Name:</strong> {project.name}</p>
                  <p><strong>Project ID:</strong> {project.project_id}</p>
                  <p><strong>Status:</strong> {getStatusBadge(project.status)}</p>
                  <p><strong>Error Type:</strong> {project.error_type !== 'NONE' ? getStatusBadge(project.error_type) : 'None'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Processing Completed Date:</strong> {formatDate(project.processing_completed_date)}</p>
                  <p><strong>Testing Start Date:</strong> {formatDate(project.testing_start_date)}</p>
                  <p><strong>Testing Completion Date:</strong> {formatDate(project.testing_completion_date)}</p>
                  <p><strong>Total Time:</strong> {formatTotalTime(project.testing_start_date, project.testing_completion_date)}</p>
                </Col>
              </Row>
              
              {project.issues && (
                <Row className="mt-3">
                  <Col md={12}>
                    <h5>Issues</h5>
                    <div className="p-3 bg-light rounded">
                      {project.issues}
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Tab.Container defaultActiveKey="testing">
        <Card>
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="testing">Testing Status</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="rsa">RSA Status</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="xls">XLS Status</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="testing">
                <RoadTable 
                  roads={sortedRoads} 
                  statusField="testing_status"
                  issuesField="testing_issues"
                  title="Testing Status"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="rsa">
                <RoadTable 
                  roads={sortedRoads} 
                  statusField="rsa_status"
                  issuesField="rsa_issues"
                  title="RSA Status"
                />
              </Tab.Pane>
              <Tab.Pane eventKey="xls">
                <RoadTable 
                  roads={sortedRoads} 
                  statusField="xls_status"
                  issuesField="xls_issues"
                  title="XLS Status"
                />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
};

const RoadTable = ({ roads, statusField, issuesField, title }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge bg="info">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge bg="primary">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge bg="success">Completed</Badge>;
      case 'FAILED':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <h5 className="mb-3">{title}</h5>
      {roads.length === 0 ? (
        <p>No roads found for this project</p>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Road Name</th>
              <th>Road ID</th>
              <th>Road Type</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {roads.map(road => (
              <tr key={road.id} onClick={() => window.location.href = `/road/${road.id}`}>
                <td>{road.name}</td>
                <td>{road.road_id}</td>
                <td>{road.road_type}</td>
                <td>{getStatusBadge(road[statusField])}</td>
                <td>{road.tester_assigned || 'Not assigned'}</td>
                <td>
                  {road[issuesField] ? (
                    <span className="text-danger">Yes</span>
                  ) : (
                    <span className="text-success">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProjectDetail;