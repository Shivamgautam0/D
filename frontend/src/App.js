// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetail';
import RoadList from './components/roads/RoadList';
import RoadDetail from './components/roads/RoadDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container-fluid mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:status" element={<ProjectList />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/project/:id/roads" element={<RoadList />} />
            <Route path="/project/:id/roads/:status" element={<RoadList />} />
            <Route path="/road/:id" element={<RoadDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

// src/App.css
import './App.css';