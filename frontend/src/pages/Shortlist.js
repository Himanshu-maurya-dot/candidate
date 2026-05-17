import React, { useState } from 'react';
import { matchCandidates, aiShortlist } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import AIResultCard from '../components/AIResultCard';
import MatchScoreChart from '../components/MatchScoreChart';
import './Shortlist.css';

const INITIAL_JOB = { requiredSkillsInput: '', requiredSkills: [], preferredSkillsInput: '', preferredSkills: [], minExperience: '' };

const Shortlist = () => {
  const [job, setJob] = useState(INITIAL_JOB);
  const [basicResults, setBasicResults] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [loadingBasic, setLoadingBasic] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'ai'

  const addSkillTo = (field, inputField, value) => {
    const skill = value.trim();
    if (skill && !job[field].map((s) => s.toLowerCase()).includes(skill.toLowerCase())) {
      setJob({ ...job, [field]: [...job[field], skill], [inputField]: '' });
    } else {
      setJob({ ...job, [inputField]: '' });
    }
  };

  const removeSkill = (field, s) => setJob({ ...job, [field]: job[field].filter((x) => x !== s) });

  const handleKeyDown = (e, field, inputField) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillTo(field, inputField, job[inputField]);
    }
  };

  const handleBasicMatch = async () => {
    if (job.requiredSkills.length === 0) { setError('Add at least one required skill.'); return; }
    setError(null);
    setLoadingBasic(true);
    try {
      const res = await matchCandidates({
        requiredSkills: job.requiredSkills,
        minExperience: Number(job.minExperience) || 0,
        preferredSkills: job.preferredSkills,
      });
      setBasicResults(res.data);
      setActiveTab('basic');
    } catch (err) {
      setError(err.response?.data?.error || 'Matching failed.');
    } finally {
      setLoadingBasic(false);
    }
  };

  const handleAIMatch = async () => {
    if (job.requiredSkills.length === 0) { setError('Add at least one required skill.'); return; }
    setError(null);
    setLoadingAI(true);
    try {
      const res = await aiShortlist({
        requiredSkills: job.requiredSkills,
        minExperience: Number(job.minExperience) || 0,
        preferredSkills: job.preferredSkills,
      });
      setAiResults(res.data);
      setActiveTab('ai');
    } catch (err) {
      setError(err.response?.data?.error || 'AI shortlisting failed. Check your OpenRouter API key.');
    } finally {
      setLoadingAI(false);
    }
  };

  const SkillInputGroup = ({ label, field, inputField }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="skill-input-row">
        <input
          value={job[inputField]}
          onChange={(e) => setJob({ ...job, [inputField]: e.target.value })}
          onKeyDown={(e) => handleKeyDown(e, field, inputField)}
          placeholder="Type skill, press Enter…"
        />
        <button type="button" className="btn btn--outline btn--md" onClick={() => addSkillTo(field, inputField, job[inputField])}>Add</button>
      </div>
      {job[field].length > 0 && (
        <div className="skills-preview">
          {job[field].map((s) => (
            <span key={s} className={`skill-chip ${field === 'requiredSkills' ? 'skill-chip--required' : 'skill-chip--preferred'}`}>
              {s}
              <button type="button" onClick={() => removeSkill(field, s)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const showResults = basicResults || aiResults;

  return (
    <div className="shortlist-page">
      <div className="shortlist-layout">
        {/* JOB FORM PANEL */}
        <aside className="job-panel">
          <h2 className="job-panel__title">Job Requirements</h2>

          <SkillInputGroup label="Required Skills *" field="requiredSkills" inputField="requiredSkillsInput" />
          <SkillInputGroup label="Preferred Skills" field="preferredSkills" inputField="preferredSkillsInput" />

          <div className="form-group">
            <label>Minimum Experience (years)</label>
            <input
              type="number"
              min="0"
              value={job.minExperience}
              onChange={(e) => setJob({ ...job, minExperience: e.target.value })}
              placeholder="0"
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="job-panel__actions">
            <button className="btn btn--primary btn--lg" onClick={handleBasicMatch} disabled={loadingBasic || loadingAI}>
              {loadingBasic ? 'Matching…' : '🎯 Basic Match'}
            </button>
            <button className="btn btn--ai btn--lg" onClick={handleAIMatch} disabled={loadingBasic || loadingAI}>
              {loadingAI ? 'Analyzing…' : '🤖 AI Shortlist'}
            </button>
          </div>
        </aside>

        {/* RESULTS PANEL */}
        <main className="results-panel">
          {!showResults && !loadingBasic && !loadingAI && (
            <div className="empty-state">
              <span>🔍</span>
              <p>Set job requirements on the left and click <strong>Basic Match</strong> or <strong>AI Shortlist</strong>.</p>
            </div>
          )}

          {(loadingBasic || loadingAI) && (
            <div className="empty-state">
              <span className="spinner">⏳</span>
              <p>{loadingAI ? 'AI is analyzing candidates…' : 'Matching candidates…'}</p>
            </div>
          )}

          {showResults && !loadingBasic && !loadingAI && (
            <>
              <div className="results-tabs">
                {basicResults && (
                  <button className={`tab ${activeTab === 'basic' ? 'tab--active' : ''}`} onClick={() => setActiveTab('basic')}>
                    🎯 Basic Match ({basicResults.total})
                  </button>
                )}
                {aiResults && (
                  <button className={`tab ${activeTab === 'ai' ? 'tab--active' : ''}`} onClick={() => setActiveTab('ai')}>
                    🤖 AI Results ({aiResults.total})
                  </button>
                )}
              </div>

              {activeTab === 'basic' && basicResults && (
                <>
                  {basicResults.results.length > 0 && (
                    <div className="chart-container">
                      <h3 className="chart-title">Match Score Overview</h3>
                      <MatchScoreChart candidates={basicResults.results} />
                    </div>
                  )}
                  <div className="results-list">
                    {basicResults.results.length === 0 ? (
                      <div className="empty-state"><span>😔</span><p>No candidates matched your criteria.</p></div>
                    ) : (
                      basicResults.results.map((c) => (
                        <CandidateCard
                          key={c._id}
                          candidate={c}
                          matchedSkills={c.matchedSkills}
                          matchScore={c.matchScore}
                          tier={c.tier}
                        />
                      ))
                    )}
                  </div>
                </>
              )}

              {activeTab === 'ai' && aiResults && (
                <div className="results-list">
                  {aiResults.results.length === 0 ? (
                    <div className="empty-state"><span>😔</span><p>No AI results available.</p></div>
                  ) : (
                    aiResults.results.map((r, i) => (
                      <AIResultCard key={r._id || i} result={r} rank={r.rank || i + 1} />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shortlist;
