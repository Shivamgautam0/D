// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProjects } from '../../services/api';
import ProjectSummaryCard from './ProjectSummaryCard';
import StatusChart from './StatusChart';

const Dashboard = () => {
  const [projectsData, setProjectsData] = useState({
    testing: [],
    completed: [],
    failed: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testingRes, completedRes, failedRes] = await Promise.all([
          getProjects('testing'),
          getProjects('completed'),
          getProjects('failed')
        ]);
        
        setProjectsData({
          testing: testingRes.results || testingRes,
          completed: completedRes.results || completedRes,
          failed: failedRes.results || failedRes
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTotalCounts = () => {
    return {
      testing: projectsData.testing.length,
      completed: projectsData.completed.length,
      failed: projectsData.failed.length,
      total: projectsData.testing.length + projectsData.completed.length + projectsData.failed.length
    };
  };

  if (loading) {
    return <div className="text-center mt-5">Loading dashboard data...</div>;
  }

  const counts = getTotalCounts();

  return (
    <div>
      <h1 className="mb-4">Testing Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{counts.total}</h3>
              <Card.Text>Total Projects</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white">
            <Card.Body>
              <h3>{counts.testing}</h3>
              <Card.Text>Under Testing</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/projects/testing" className="text-white">View All</Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h3>{counts.completed}</h3>
              <Card.Text>Completed</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/projects/completed" className="text-white">View All</Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-danger text-white">
            <Card.Body>
              <h3>{counts.failed}</h3>
              <Card.Text>Failed</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/projects/failed" className="text-white">View All</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Row>
            <Col md={12} className="mb-4">
              <ProjectSummaryCard 
                title="Recent Under Testing Projects" 
                projects={projectsData.testing.slice(0, 5)} 
                status="testing"
                linkTo="/projects/testing"
              />
            </Col>
            <Col md={12} className="mb-4">
              <ProjectSummaryCard 
                title="Recently Completed Projects" 
                projects={projectsData.completed.slice(0, 5)} 
                status="completed"
                linkTo="/projects/completed"
              />
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Project Status Distribution</Card.Header>
            <Card.Body>
              <StatusChart data={counts} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;