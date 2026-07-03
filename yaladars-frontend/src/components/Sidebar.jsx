import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

// Simple SVG icons inline
const icons = {
  overview:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  sessions:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  search:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  bookmark:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  profile:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  logout:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  inbox:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  clock:      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  star:       <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

const studentNav = [
  { key: 'overview',  label: 'Overview',       path: '/student/dashboard', icon: icons.overview },
  { key: 'bookings',  label: 'My Bookings',    path: '/student/dashboard?tab=bookings', icon: icons.bookmark },
  { key: 'sessions',  label: 'Sessions',       path: '/student/dashboard?tab=sessions', icon: icons.clock },
  { key: 'find',      label: 'Find Tutors',    path: '/tutors', icon: icons.search },
  { key: 'reviews',   label: 'Reviews',        path: '/student/dashboard?tab=achievements', icon: icons.star },
];

const tutorNav = [
  { key: 'overview',  label: 'Overview',       path: '/tutor/dashboard', icon: icons.overview },
  { key: 'requests',  label: 'Booking Requests', path: '/tutor/dashboard?tab=requests', icon: icons.inbox },
  { key: 'sessions',  label: 'Sessions',       path: '/tutor/dashboard?tab=sessions', icon: icons.clock },
  { key: 'profile',   label: 'My Profile',     path: '/tutor/dashboard?tab=profile', icon: icons.profile },
];

const Sidebar = ({ role = 'STUDENT', activeTab, onTabChange }) => {
  const navigate  = useNavigate();
  const firstName = localStorage.getItem('userFirstName') || 'User';
  const lastName  = localStorage.getItem('userLastName')  || '';
  const email     = localStorage.getItem('userEmail')     || '';

  const navItems = role === 'TUTOR' ? tutorNav : studentNav;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavClick = (item) => {
    if (onTabChange) {
      const tab = item.key;
      onTabChange(tab);
    } else {
      navigate(item.path);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">Y</div>
        <span className="sidebar-logo-text">YalaDars</span>
      </Link>

      <div className="sidebar-divider" />

      {/* User info */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">{firstName.charAt(0)}{lastName.charAt(0)}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{firstName} {lastName}</div>
          <div className="sidebar-user-role">{role === 'TUTOR' ? 'Tutor' : 'Student'}</div>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`sidebar-nav-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <button className="sidebar-nav-item" onClick={handleLogout}>
          <span className="sidebar-nav-icon">{icons.logout}</span>
          <span className="sidebar-nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
