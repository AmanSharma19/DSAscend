import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Plus, MousePointer2, Trash2 } from 'lucide-react';
import { saveToHistory, delay } from '../utils/helpers';
import './GraphVisualizer.css';

const GraphVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedEdges, setVisitedEdges] = useState([]);
    const [mode, setMode] = useState('addNode'); // 'addNode', 'addEdge', 'delete'
    const [selectedNode, setSelectedNode] = useState(null);
    const [message, setMessage] = useState('Click on the canvas to add nodes.');

    const svgRef = useRef(null);

    const handleCanvasClick = (e) => {
        if (isVisualizing) return;
        
        const svg = svgRef.current;
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (mode === 'addNode') {
            const newNode = {
                id: nodes.length,
                x,
                y,
                label: String.fromCharCode(65 + nodes.length % 26) + (nodes.length >= 26 ? Math.floor(nodes.length / 26) : '')
            };
            setNodes([...nodes, newNode]);
            setMessage(`Added node ${newNode.label}`);
        }
    };

    const handleNodeClick = (e, node) => {
        e.stopPropagation();
        if (isVisualizing) return;

        if (mode === 'delete') {
            setNodes(nodes.filter(n => n.id !== node.id));
            setEdges(edges.filter(edge => edge.from !== node.id && edge.to !== node.id));
            setMessage(`Deleted node ${node.label}`);
        } else if (mode === 'addEdge') {
            if (selectedNode === null) {
                setSelectedNode(node);
                setMessage(`Selected node ${node.label}. Now select target node.`);
            } else if (selectedNode.id !== node.id) {
                // Check if edge already exists
                const exists = edges.some(edge => 
                    (edge.from === selectedNode.id && edge.to === node.id) || 
                    (edge.from === node.id && edge.to === selectedNode.id)
                );
                
                if (!exists) {
                    const newEdge = {
                        from: selectedNode.id,
                        to: node.id
                    };
                    setEdges([...edges, newEdge]);
                    setMessage(`Connected ${selectedNode.label} to ${node.label}`);
                }
                setSelectedNode(null);
            }
        }
    };

    const reset = () => {
        if (isVisualizing) return;
        setNodes([]);
        setEdges([]);
        setVisitedNodes([]);
        setVisitedEdges([]);
        setSelectedNode(null);
        setMessage('Graph cleared.');
    };

    const runBFS = async () => {
        if (nodes.length === 0 || isVisualizing) return;
        setIsVisualizing(true);
        setVisitedNodes([]);
        setVisitedEdges([]);
        
        const startNodeId = nodes[0].id; // Default to first node
        const queue = [startNodeId];
        const visitedSet = new Set([startNodeId]);
        const resultNodes = [];
        const resultEdges = [];

        saveToHistory(`Graph: BFS from Node ${nodes[0].label}`, 'graph', 'bfs', { nodesCount: nodes.length, edgesCount: edges.length });

        while (queue.length > 0) {
            const currentId = queue.shift();
            resultNodes.push(currentId);
            setVisitedNodes(prev => [...prev, currentId]);
            setMessage(`Visiting node ${nodes.find(n => n.id === currentId).label}`);
            await delay(600);

            const neighbors = edges
                .filter(e => e.from === currentId || e.to === currentId)
                .map(e => e.from === currentId ? e.to : e.from);

            for (const neighborId of neighbors) {
                if (!visitedSet.has(neighborId)) {
                    visitedSet.add(neighborId);
                    queue.push(neighborId);
                    
                    const edgeId = edges.find(e => 
                        (e.from === currentId && e.to === neighborId) || 
                        (e.from === neighborId && e.to === currentId)
                    );
                    resultEdges.push(edgeId);
                    setVisitedEdges(prev => [...prev, edgeId]);
                    await delay(300);
                }
            }
        }
        
        setMessage('BFS Traversal completed.');
        setIsVisualizing(false);
    };

    const runDFS = async () => {
        if (nodes.length === 0 || isVisualizing) return;
        setIsVisualizing(true);
        setVisitedNodes([]);
        setVisitedEdges([]);

        const visitedSet = new Set();
        const startNodeId = nodes[0].id;

        saveToHistory(`Graph: DFS from Node ${nodes[0].label}`, 'graph', 'dfs', { nodesCount: nodes.length, edgesCount: edges.length });

        const dfsRecursive = async (currentId, parentId = null) => {
            visitedSet.add(currentId);
            setVisitedNodes(prev => [...prev, currentId]);
            setMessage(`Visiting node ${nodes.find(n => n.id === currentId).label}`);
            
            if (parentId !== null) {
                const edge = edges.find(e => 
                    (e.from === currentId && e.to === parentId) || 
                    (e.from === parentId && e.to === currentId)
                );
                setVisitedEdges(prev => [...prev, edge]);
            }
            
            await delay(800);

            const neighbors = edges
                .filter(e => e.from === currentId || e.to === currentId)
                .map(e => e.from === currentId ? e.to : e.from);

            for (const neighborId of neighbors) {
                if (!visitedSet.has(neighborId)) {
                    await dfsRecursive(neighborId, currentId);
                }
            }
        };

        await dfsRecursive(startNodeId);
        
        setMessage('DFS Traversal completed.');
        setIsVisualizing(false);
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Graph Visualizer</h1>
                <p>Build custom graphs and trace fundamental traversal algorithms like BFS and DFS.</p>
            </header>

            <div className="graph-controls-panel">
                <div className="mode-selector">
                    <button 
                        className={`mode-btn ${mode === 'addNode' ? 'active' : ''}`}
                        onClick={() => setMode('addNode')}
                    >
                        <Plus size={18} /> Add Node
                    </button>
                    <button 
                        className={`mode-btn ${mode === 'addEdge' ? 'active' : ''}`}
                        onClick={() => { setMode('addEdge'); setSelectedNode(null); }}
                    >
                        <MousePointer2 size={18} /> Add Edge
                    </button>
                    <button 
                        className={`mode-btn ${mode === 'delete' ? 'active' : ''}`}
                        onClick={() => setMode('delete')}
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                </div>

                <div className="algo-actions">
                    <button className="btn success" onClick={runBFS} disabled={isVisualizing || nodes.length === 0}>
                        <Play size={18} /> BFS Traversal
                    </button>
                    <button className="btn info" onClick={runDFS} disabled={isVisualizing || nodes.length === 0}>
                        <Play size={18} /> DFS Traversal
                    </button>
                    <button className="btn danger" onClick={reset} disabled={isVisualizing}>
                        <RotateCcw size={18} /> Reset
                    </button>
                </div>
            </div>

            <div className="graph-display-container">
                <div className="status-badge">
                   {message}
                </div>
                <svg 
                    ref={svgRef}
                    className="graph-canvas"
                    onClick={handleCanvasClick}
                >
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="20" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                        </marker>
                    </defs>
                    
                    {/* Edges */}
                    {edges.map((edge, idx) => {
                        const fromNode = nodes.find(n => n.id === edge.from);
                        const toNode = nodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;
                        
                        const isVisited = visitedEdges.includes(edge);
                        
                        return (
                            <line
                                key={`edge-${idx}`}
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                className={`graph-edge ${isVisited ? 'visited' : ''}`}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => {
                        const isVisited = visitedNodes.includes(node.id);
                        const isSelected = selectedNode && selectedNode.id === node.id;
                        
                        return (
                            <g 
                                key={node.id} 
                                className={`graph-node-group ${isVisited ? 'visited' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={(e) => handleNodeClick(e, node)}
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="20"
                                    className="graph-node-circle"
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    dy=".3em"
                                    textAnchor="middle"
                                    className="graph-node-label"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default GraphVisualizer;
