import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';
import PathfindingVisualizer from './pages/PathfindingVisualizer';
import DataStructuresVisualizer from './pages/DataStructuresVisualizer';
import TreeVisualizer from './pages/TreeVisualizer';
import DPVisualizer from './pages/DPVisualizer';
import GraphVisualizer from './pages/GraphVisualizer';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from './config';
import './App.css';

function AppContent() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showAuth, setShowAuth] = useState(false);
    const [authType, setAuthType] = useState('signup');
    const [user, setUser] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    }, [isDarkMode]);

    // Check for logged in user on mount
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (err) {
                console.error('Session validation failed', err);
            }
        };
        checkLoggedIn();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const handleLoginClick = (type) => {
        setAuthType(type);
        setShowAuth(true);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        toast.info('Logged out successfully');
    };

    const handleSuccessfulLogin = (userData) => {
        setUser(userData);
        toast.success(`Welcome back, ${userData.username}!`);
        setShowAuth(false);
        navigate('/');
    };

    return (
        <>
            <div className="app-container">
                <Navbar 
                    toggleTheme={toggleTheme} 
                    isDarkMode={isDarkMode} 
                    user={user} 
                    onLoginClick={() => handleLoginClick('login')}
                    onLogout={handleLogout}
                    isSidebarCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
                <main className={`main-content-layout ${isSidebarCollapsed ? 'expanded' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sorting" element={<SortingVisualizer />} />
                        <Route path="/pathfinding" element={<PathfindingVisualizer />} />
                        <Route path="/datastructures" element={<DataStructuresVisualizer />} />
                        <Route path="/trees" element={<TreeVisualizer />} />
                        <Route path="/dynamic-programming" element={<DPVisualizer />} />
                        <Route path="/graph" element={<GraphVisualizer />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                    <Footer />
                </main>
            </div>
            
            <AuthModal 
                isOpen={showAuth} 
                onClose={() => setShowAuth(false)} 
                initialType={authType} 
                onLogin={handleSuccessfulLogin}
            />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                theme={isDarkMode ? 'dark' : 'light'}
            />
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
