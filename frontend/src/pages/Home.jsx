import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, GitBranch, Network, LayoutGrid, Compass, Quote, Share2 } from 'lucide-react';
import HomeCompiler from '../components/HomeCompiler';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-hero">
                <div className="hero-ambient-glow glow-left"></div>
                <div className="hero-ambient-glow glow-right"></div>
                <h1>Interactive <span className="brand-text">DSA<span className="brand-accent">scend</span></span></h1>
                <p>Visualize complex Data Structures and Algorithms through an intuitive and interactive platform. Select a category below to get started.</p>
            </header>

            <div className="categories-grid">
                <div className="card-wrapper">
                    <div className="card-glow glow-1"></div>
                    <Link to="/sorting" className="category-card">
                        <div className="card-icon blue">
                            <BarChart3 size={32} />
                        </div>
                        <h2>Sorting Algorithms</h2>
                        <p>Explore algorithms like Bubble Sort, Selection Sort, Merge Sort, and Quick Sort. Watch how arrays are sorted step-by-step.</p>
                        <div className="tags">
                            <span className="tag">Arrays</span>
                            <span className="tag">O(n log n)</span>
                            <span className="tag">Divide & Conquer</span>
                        </div>
                    </Link>
                </div>

                <div className="card-wrapper">
                    <div className="card-glow glow-2"></div>
                    <Link to="/pathfinding" className="category-card">
                        <div className="card-icon emerald">
                            <Compass size={32} />
                        </div>
                        <h2>Pathfinding Visualizer</h2>
                        <p>Visualize Dijkstra's, A* Search, and BFS algorithms on a grid. Build walls, move start/end points, and find the shortest path!</p>
                        <div className="tags">
                            <span className="tag">Graphs</span>
                            <span className="tag">Shortest Path</span>
                            <span className="tag">Grid</span>
                        </div>
                    </Link>
                </div>
                
                <div className="card-wrapper">
                    <div className="card-glow glow-3"></div>
                    <Link to="/datastructures" className="category-card">
                        <div className="card-icon purple">
                            <Network size={32} />
                        </div>
                        <h2>Linear Data Structures</h2>
                        <p>Interact with memory models representing Stacks (LIFO) and Queues (FIFO). Push, Pop, Enqueue and Dequeue in real-time.</p>
                        <div className="tags">
                            <span className="tag">Stack & Queue</span>
                            <span className="tag">LIFO/FIFO</span>
                        </div>
                    </Link>
                </div>
                
                <div className="card-wrapper">
                    <div className="card-glow glow-4"></div>
                    <Link to="/trees" className="category-card">
                        <div className="card-icon amber">
                            <GitBranch size={32} />
                        </div>
                        <h2>Tree Visualizer</h2>
                        <p>Traverse through Binary Search Trees (BST) and visualize operations like insertion and traversal in real-time.</p>
                        <div className="tags">
                            <span className="tag">BST</span>
                            <span className="tag">Traversals</span>
                        </div>
                    </Link>
                </div>

                <div className="card-wrapper">
                    <div className="card-glow glow-5"></div>
                    <Link to="/dynamic-programming" className="category-card">
                        <div className="card-icon rose">
                            <LayoutGrid size={32} />
                        </div>
                        <h2>Dynamic Programming</h2>
                        <p>Visualize tabulation approaches for classic optimization problems like Fibonacci and Longest Common Subsequence.</p>
                        <div className="tags">
                            <span className="tag">Tabulation</span>
                            <span className="tag">Memoization</span>
                        </div>
                    </Link>
                </div>

                <div className="card-wrapper">
                    <div className="card-glow glow-1"></div>
                    <Link to="/graph" className="category-card">
                        <div className="card-icon indigo">
                            <Share2 size={32} />
                        </div>
                        <h2>Graph Visualizer</h2>
                        <p>Build custom graphs with nodes and edges. Explore fundamental graph theory concepts and traversal algorithms like BFS and DFS.</p>
                        <div className="tags">
                            <span className="tag">Nodes & Edges</span>
                            <span className="tag">Adjacency</span>
                            <span className="tag">BFS/DFS</span>
                        </div>
                    </Link>
                </div>
            </div>

            <HomeCompiler />

            <section className="testimonials-section">
                <div className="testimonials-header">
                    <h2>What Developers Are Saying</h2>
                    <p>Join thousands of students and professionals mastering algorithms with DSAscend.</p>
                </div>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <Quote className="quote-icon" size={24} />
                        <p className="testimonial-text">"Before DSAscend, tracing Dijkstra's algorithm manually was a nightmare. Seeing the graph nodes light up step-by-step completely gave me the "aha" moment I needed to ace my interview!"</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-red">ES</div>
                            <div className="author-info">
                                <strong>Elena S.</strong>
                                <span>Software Engineer II</span>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <Quote className="quote-icon" size={24} />
                        <p className="testimonial-text">"The sorting visualizer is simply beautiful. The dark UI mixed with the intense glowing bars completely locks in my focus. It makes learning these classic algorithms feel like playing a premium app."</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-blue">JD</div>
                            <div className="author-info">
                                <strong>James D.</strong>
                                <span>CS Student</span>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <Quote className="quote-icon" size={24} />
                        <p className="testimonial-text">"I love how flexible the new physics and node-dragging feels on the pathfinder. DSAscend completely reinvented the way my bootcamp cohort studies graphs."</p>
                        <div className="testimonial-author">
                            <div className="author-avatar bg-emerald">MT</div>
                            <div className="author-info">
                                <strong>Marcus T.</strong>
                                <span>Bootcamp Instructor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
