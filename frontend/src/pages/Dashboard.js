import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCandidates } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, skills: 0, avgExp: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCandidates()
      .then((res) => {
        const candidates = res.data;
        const allSkills = new Set(candidates.flatMap((c) => c.skills.map((s) => s.toLowerCase())));
        const avgExp =
          candidates.length > 0
            ? (candidates.reduce((sum, c) => sum + c.experience, 0) / candidates.length).toFixed(1)
            : 0;
        setStats({ total: candidates.length, skills: allSkills.size, avgExp });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Candidates', value: loading ? '…' : stats.total, icon: '👥', color: '#4f46e5' },
    { label: 'Unique Skills', value: loading ? '…' : stats.skills, icon: '🛠️', color: '#06b6d4' },
    { label: 'Avg Experience', value: loading ? '…' : `${stats.avgExp} yrs`, icon: '📅', color: '#10b981' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__hero">
        <h1>Candidate Shortlisting System</h1>
        <p>Find and rank the best candidates using skill matching and AI-powered analysis.</p>
      </div>

      <div className="dashboard__stats">
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-card__icon" style={{ background: color + '20', color }}>{icon}</div>
            <div>
              <div className="stat-card__value">{value}</div>
              <div className="stat-card__label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__actions">
        <Link to="/add-candidate" className="action-card">
          <span className="action-card__icon">➕</span>
          <div>
            <h3>Add Candidate</h3>
            <p>Register a new candidate profile</p>
          </div>
        </Link>
        <Link to="/shortlist" className="action-card">
          <span className="action-card__icon">🎯</span>
          <div>
            <h3>Shortlist Candidates</h3>
            <p>Match candidates to job requirements</p>
          </div>
        </Link>
        <Link to="/candidates" className="action-card">
          <span className="action-card__icon">📋</span>
          <div>
            <h3>View All Candidates</h3>
            <p>Browse and search candidate profiles</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
