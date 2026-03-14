import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2, Database, ChevronRight, Layout, Code2, GitBranch, BarChart2, Share2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/visualizations/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setHistory(data);
            }
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/visualizations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setHistory(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    const handleContinue = (item) => {
        const state = { restoredData: item.data };
        
        if (item.data && item.data.code) {
            navigate('/', { state });
            return;
        }

        switch (item.type) {
            case 'sorting':
                navigate(`/sorting?algo=${item.algo}`, { state });
                break;
            case 'tree':
                navigate('/trees', { state });
                break;
            case 'datastructures':
                navigate('/datastructures', { state });
                break;
            case 'pathfinding':
                navigate('/pathfinding', { state });
                break;
            case 'dp':
                navigate('/dynamic-programming', { state });
                break;
            case 'graph':
                navigate('/graph', { state });
                break;
            default:
                navigate('/');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'sorting': return <BarChart2 size={24} color="#3b82f6" />;
            case 'tree': return <GitBranch size={24} color="#10b981" />;
            case 'pathfinding': return <Layout size={24} color="#8b5cf6" />;
            case 'dp': return <Code2 size={24} color="#f59e0b" />;
            case 'graph': return <Share2 size={24} color="#6366f1" />;
            default: return <Database size={24} color="#64748b" />;
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loader-wrapper">
                    <div className="loader"></div>
                </div>
                <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', color: '#3b82f6', fontWeight: '600', marginTop: '10px' }}> Synchronizing Local Vault...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Algorithm <span style={{ color: '#3b82f6' }}>Analytics</span></h1>
                    <p>Track your cognitive progress, revisit deep-dives, and manage your algorithmic footprint.</p>
                </div>
            </header>

            <div className="dashboard-grid">
                <div className="stats-panel">
                    <div className="stat-card">
                        <h3>Knowledge Nodes</h3>
                        <div className="stat-value">{history.length}</div>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '10px' }}>Visualizations archived in your local vault.</p>
                    </div>
                </div>

                <div className="history-panel">
                    <div className="panel-header">
                        <h2><Clock size={22} color="#3b82f6" /> System Logs & History</h2>
                        <span className="activity-tag">Live Feed</span>
                    </div>

                    {history.length === 0 ? (
                        <div className="empty-history">
                            <Database size={48} opacity={0.2} />
                            <p>No visualization history yet. Start learning to see it here!</p>
                            <button className="btn success" onClick={() => navigate('/')}>Explore Algorithms</button>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map((item) => (
                                <div key={item._id} className="history-item" onClick={() => handleContinue(item)}>
                                    <div className="item-icon">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.title}</h3>
                                        <div className="item-meta">
                                            <span className="algo-badge">{item.algo.charAt(0).toUpperCase() + item.algo.slice(1)}</span>
                                            <span className="dot"></span>
                                            <span>Analyzed on {new Date(item.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button className="action-btn delete" onClick={(e) => handleDelete(item._id, e)} title="Delete Log">
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="action-btn continue">
                                            Reconstruct <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
