import React from 'react';
import SkillTag from './SkillTag';
import './AIResultCard.css';

const AIResultCard = ({ result, rank }) => {
  return (
    <div className="ai-card">
      <div className="ai-card__rank">#{rank}</div>
      <div className="ai-card__content">
        <div className="ai-card__header">
          <div className="ai-card__avatar">{result.name.charAt(0).toUpperCase()}</div>
          <div>
            <h3 className="ai-card__name">{result.name}</h3>
            <p className="ai-card__email">{result.email}</p>
          </div>
          <div className="ai-card__score-badge">{result.matchScore}%</div>
        </div>

        <p className="ai-card__recommendation">🤖 {result.recommendation}</p>

        {result.strengths?.length > 0 && (
          <div className="ai-card__section">
            <span className="ai-card__section-label">✅ Strengths</span>
            <div className="ai-card__tags">
              {result.strengths.map((s) => (
                <SkillTag key={s} skill={s} matched />
              ))}
            </div>
          </div>
        )}

        {result.gaps?.length > 0 && (
          <div className="ai-card__section">
            <span className="ai-card__section-label">⚠️ Gaps</span>
            <div className="ai-card__tags">
              {result.gaps.map((g) => (
                <SkillTag key={g} skill={g} />
              ))}
            </div>
          </div>
        )}

        <div className="ai-card__footer">
          <span className="ai-card__exp">{result.experience} yr{result.experience !== 1 ? 's' : ''} exp</span>
          <div className="ai-card__skills">
            {(result.skills || []).map((s) => (
              <SkillTag key={s} skill={s} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultCard;
