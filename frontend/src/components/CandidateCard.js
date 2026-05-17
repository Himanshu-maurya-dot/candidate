import React from 'react';
import SkillTag from './SkillTag';
import './CandidateCard.css';

const CandidateCard = ({ candidate, matchedSkills = [], matchScore, tier, onDelete }) => {
  const matchedSet = new Set((matchedSkills || []).map((s) => s.toLowerCase()));

  const tierColor = { High: 'tier--high', Medium: 'tier--medium', Low: 'tier--low' };

  return (
    <div className={`candidate-card ${tier ? `candidate-card--${tier.toLowerCase()}` : ''}`}>
      <div className="candidate-card__header">
        <div className="candidate-card__avatar">{candidate.name.charAt(0).toUpperCase()}</div>
        <div className="candidate-card__info">
          <h3 className="candidate-card__name">{candidate.name}</h3>
          <p className="candidate-card__email">{candidate.email}</p>
        </div>
        <div className="candidate-card__meta">
          <span className="candidate-card__exp">{candidate.experience} yr{candidate.experience !== 1 ? 's' : ''}</span>
          {tier && <span className={`tier-badge ${tierColor[tier] || ''}`}>{tier}</span>}
        </div>
      </div>

      {matchScore !== undefined && (
        <div className="candidate-card__score">
          <div className="score-bar">
            <div className="score-bar__fill" style={{ width: `${matchScore}%`, background: scoreColor(matchScore) }} />
          </div>
          <span className="score-label">{matchScore}% match</span>
        </div>
      )}

      <div className="candidate-card__skills">
        {candidate.skills.map((skill) => (
          <SkillTag key={skill} skill={skill} matched={matchedSet.has(skill.toLowerCase())} />
        ))}
      </div>

      {candidate.bio && <p className="candidate-card__bio">{candidate.bio}</p>}

      {onDelete && (
        <button className="btn btn--danger btn--sm candidate-card__delete" onClick={() => onDelete(candidate._id)}>
          Remove
        </button>
      )}
    </div>
  );
};

function scoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default CandidateCard;
