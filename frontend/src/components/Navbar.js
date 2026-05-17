import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/candidates', label: 'Candidates' },
    { to: '/add-candidate', label: 'Add Candidate' },
    { to: '/shortlist', label: 'Shortlist' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__icon">🎯</span>
        <span className="navbar__title">TalentMatch</span>
      </div>
      <ul className="navbar__links">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
