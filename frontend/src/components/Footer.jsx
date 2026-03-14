import React from 'react';
import './Footer.css';
import { Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-grid">
                    <div className="footer-section brand-section">
                        <h3><span className="brand-text">DSA<span className="brand-accent">scend</span></span></h3>
                        <p>Visualizing algorithms on the web to make computer science interactive. Powered by advanced AI tools to break down complexities step-by-step.</p>
                        <div className="social-links mt-4">
                            <a href="https://github.com/AmanSharma19" target="_blank" rel="noopener noreferrer" aria-label="Github"><Github size={20} /></a>
                            <a href="https://www.linkedin.com/in/amans8/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        </div>
                    </div>
                    
                    <div className="footer-section links-section">
                        <h4>Visualizers</h4>
                        <ul>
                            <li><a href="/sorting">Sorting Algorithms</a></li>
                            <li><a href="/pathfinding">Pathfinding</a></li>
                            <li><a href="/datastructures">Data Structures</a></li>
                        </ul>
                    </div>

                    <div className="footer-section ai-section">
                        <h4>AI Insights</h4>
                        <p>Our intelligent system adapts to your learning pace, highlighting specific algorithm bottlenecks like <span className="highlight-text">Time Complexity</span> and <span className="highlight-text">Space Constraints</span>.</p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Made by team QuadCore</p>
            </div>
        </footer>
    );
}

export default Footer;
