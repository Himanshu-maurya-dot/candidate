import React from 'react';
import './SkillTag.css';

const SkillTag = ({ skill, matched = false, size = 'md' }) => (
  <span className={`skill-tag skill-tag--${size} ${matched ? 'skill-tag--matched' : ''}`}>
    {skill}
  </span>
);

export default SkillTag;
