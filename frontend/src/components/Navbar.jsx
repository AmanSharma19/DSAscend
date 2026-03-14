import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Map, Layers, GitBranch, LayoutGrid, Database, Sun, Moon, User, LogOut, ChevronRight, Menu, X, Share2 } from 'lucide-react';

import './Navbar.css';

const Navbar = ({ toggleTheme, isDarkMode, user, onLoginClick, onLogout, isSidebarCollapsed, toggleSidebar }) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <>
            <div className="mobile-header">
                <Link to="/" className="mobile-logo">
                    <Database className="logo-icon" size={20} />
                    <span className="brand-text">DSA<span className="brand-accent">scend</span></span>
                </Link>
                <div className="mobile-header-actions">
                    <button className="theme-toggle-btn mobile-theme" onClick={toggleTheme} aria-label="Toggle Theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>
            )}

            <nav className={`navbar ${isMobileOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="navbar-container">
                    <div className="navbar-mobile-close">
                        <button onClick={() => setIsMobileOpen(false)} className="close-sidebar-btn">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="navbar-header">
                        <Link to="/" className="navbar-logo">
                            <Database className="logo-icon" />
                            {!isSidebarCollapsed && <span className="brand-text">DSA<span className="brand-accent">scend</span></span>}
                        </Link>
                        
                        <div className="sidebar-top-actions">
                            <button className="theme-toggle-btn desktop-theme" onClick={toggleTheme} aria-label="Toggle Theme">
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                    </div>
                <div className="navbar-links">
                    {user && (
                        <Link to="/dashboard" className={`nav-link dashboard-highlight ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            <LayoutGrid size={18} /> {!isSidebarCollapsed && <span>Dashboard</span>}
                        </Link>
                    )}
                    
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        <Home size={18} /> {!isSidebarCollapsed && <span>Home</span>}
                    </Link>
                    
                    <Link to="/sorting" className={`nav-link ${location.pathname === '/sorting' ? 'active' : ''}`}>
                        <BarChart2 size={18} /> {!isSidebarCollapsed && <span>Sorting</span>}
                    </Link>
                    
                    <Link to="/datastructures" className={`nav-link ${location.pathname === '/datastructures' ? 'active' : ''}`}>
                        <Layers size={18} /> {!isSidebarCollapsed && <span>Linear DS</span>}
                    </Link>

                    {/* Merged Non-Linear Section */}
                    <div className="dropdown">
                        <div className={`nav-link ${(location.pathname === '/trees' || location.pathname === '/dynamic-programming' || location.pathname === '/pathfinding' || location.pathname === '/graph') ? 'active' : ''}`}>
                            <GitBranch size={18} /> {!isSidebarCollapsed && <>Non-Linear <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} /></>}
                        </div>
                        <div className="dropdown-menu">
                            <Link to="/pathfinding" className={`dropdown-item ${location.pathname === '/pathfinding' ? 'active' : ''}`}>
                                <Map size={18} /> {!isSidebarCollapsed && <span>Pathfinding</span>}
                            </Link>
                            <Link to="/trees" className={`dropdown-item ${location.pathname === '/trees' ? 'active' : ''}`}>
                                <GitBranch size={18} /> {!isSidebarCollapsed && <span>Trees</span>}
                            </Link>
                            <Link to="/graph" className={`dropdown-item ${location.pathname === '/graph' ? 'active' : ''}`}>
                                <Share2 size={18} /> {!isSidebarCollapsed && <span>Graph</span>}
                            </Link>
                            <Link to="/dynamic-programming" className={`dropdown-item ${location.pathname === '/dynamic-programming' ? 'active' : ''}`}>
                                <LayoutGrid size={18} /> {!isSidebarCollapsed && <span>Dynamic Programming</span>}
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="navbar-auth">
                    {user ? (
                        <div className="logged-in-user">
                            <span className="user-greeting">
                                <User size={16} /> 
                                {!isSidebarCollapsed && <span>{user.username || user.name}</span>}
                            </span>
                            <button className="auth-btn outline" onClick={onLogout} aria-label="Logout">
                                <LogOut size={16} /> 
                                {!isSidebarCollapsed && <span>Logout</span>}
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button className="auth-btn outline" onClick={onLoginClick}>
                                {!isSidebarCollapsed ? 'Log In' : <User size={16} />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button className="sidebar-edge-toggle desktop-only" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <ChevronRight className={`toggle-icon ${isSidebarCollapsed ? '' : 'rotated'}`} size={16} />
            </button>
        </nav>
        </>
    );
};

export default Navbar;
