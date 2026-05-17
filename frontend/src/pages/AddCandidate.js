import React, { useState } from 'react';
import { addCandidate } from '../services/api';
import './AddCandidate.css';

const INITIAL = { name: '', email: '', skillInput: '', skills: [], experience: '', bio: '' };

const AddCandidate = () => {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())) {
      setForm({ ...form, skills: [...form.skills, skill], skillInput: '' });
    }
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter((x) => x !== s) });

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await addCandidate({
        name: form.name,
        email: form.email,
        skills: form.skills,
        experience: Number(form.experience),
        bio: form.bio,
      });
      setStatus({ type: 'success', msg: `${form.name} has been added successfully!` });
      setForm(INITIAL);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to add candidate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate">
      <div className="page-header">
        <h2>Add Candidate</h2>
        <p>Register a new candidate profile in the system.</p>
      </div>

      {status && (
        <div className={`alert alert--${status.type}`}>{status.msg}</div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@gmail.com" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Experience (years) *</label>
            <input name="experience" type="number" min="0" max="50" value={form.experience} onChange={handleChange} placeholder="e.g. 3" required />
          </div>
        </div>

        <div className="form-group">
          <label>Skills *</label>
          <div className="skill-input-row">
            <input
              name="skillInput"
              value={form.skillInput}
              onChange={handleChange}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter or comma"
            />
            <button type="button" className="btn btn--outline btn--md" onClick={addSkill}>Add</button>
          </div>
          {form.skills.length > 0 && (
            <div className="skills-preview">
              {form.skills.map((s) => (
                <span key={s} className="skill-chip">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Bio / Projects (optional)</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="Brief description of the candidate's background or notable projects..." />
        </div>

        <button type="submit" className="btn btn--primary btn--lg" disabled={loading || form.skills.length === 0}>
          {loading ? 'Adding…' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
};

export default AddCandidate;
