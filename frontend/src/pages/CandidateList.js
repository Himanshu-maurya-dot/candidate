import React, { useEffect, useState, useCallback } from 'react';
import { getAllCandidates, deleteCandidate } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import './CandidateList.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (search) params.search = search;
    if (skillFilter) params.skill = skillFilter;
    getAllCandidates(params)
      .then((res) => setCandidates(res.data))
      .catch(() => setError('Failed to load candidates.'))
      .finally(() => setLoading(false));
  }, [search, skillFilter]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this candidate?')) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Failed to delete candidate.');
    }
  };

  return (
    <div className="candidate-list-page">
      <div className="page-header">
        <h2>All Candidates</h2>
        <p>{loading ? '…' : `${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} found`}</p>
      </div>

      <div className="filters">
        <input
          className="filter-input"
          placeholder="🔍 Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="filter-input"
          placeholder="Filter by skill…"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="loader">Loading candidates…</div>
      ) : candidates.length === 0 ? (
        <div className="empty-state">
          <span>👤</span>
          <p>No candidates found. Try adjusting your filters or add new candidates.</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {candidates.map((c) => (
            <CandidateCard key={c._id} candidate={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
