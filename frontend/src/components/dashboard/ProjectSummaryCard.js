// src/components/dashboard/ProjectSummaryCard.js
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

const ProjectSummaryCard = ({ title, projects, status, linkTo }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'testing': return 'status-testing';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return '';
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        {title}
        <Link to={linkTo}>View All</Link>
      </Card.Header>
      <Card.Body>
        {projects.length === 0 ? (
          <p className="text-center">No projects found</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Processing Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} onClick={() => window.location.href = `/project/${project.id}`}>
                  <td>{project.name}</td>
                  <td>{project.project_id}</td>
                  <td>{moment(project.processing_completed_date).format('DD-MM-YYYY')}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export { ProjectSummaryCard };

// src/components/dashboard/StatusChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusChart = ({ data }) => {
  const chartData = {
    labels: ['Under Testing', 'Completed', 'Failed'],
    datasets: [
      {
        data: [data.testing, data.completed, data.failed],
        backgroundColor: [
          '#ffc107', // warning - yellow
          '#28a745', // success - green
          '#dc3545', // danger - red
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export { StatusChart };