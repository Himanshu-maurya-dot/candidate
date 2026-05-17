import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddCandidate from './pages/AddCandidate';
import CandidateList from './pages/CandidateList';
import Shortlist from './pages/Shortlist';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/candidates" element={<CandidateList />} />
        <Route path="/shortlist" element={<Shortlist />} />
      </Routes>
    </Router>
  );
}

export default App;
