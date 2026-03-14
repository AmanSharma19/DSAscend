import React, { useState } from 'react';
import './TreeVisualizer.css';
import { GitBranch, Plus, RotateCcw } from 'lucide-react';
import { saveToHistory } from '../utils/helpers';

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.id = Math.random().toString(36).slice(2, 11);
    }
}

const TreeVisualizer = () => {
    const [tree, setTree] = useState(null);
    const [treeType, setTreeType] = useState('bst'); // 'bst' or 'binary'
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('Build your binary tree and visualize traversal.');
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [speed] = useState(800);
    const [isAnimating, setIsAnimating] = useState(false);

    const insertBST = (node, value) => {
        if (!node) return new Node(value);
        
        const newNode = { ...node };
        if (value < node.value) {
            newNode.left = insertBST(node.left, value);
        } else if (value > node.value) {
            newNode.right = insertBST(node.right, value);
        }
        return newNode;
    };

    const insertLevelOrder = (root, value) => {
        if (!root) return new Node(value);

        // Functional Deep Clone to ensure React Strict Mode doesn't double-mutate
        const cloneTree = (node) => {
            if (!node) return null;
            return {
                ...node,
                left: cloneTree(node.left),
                right: cloneTree(node.right)
            };
        };

        const newRoot = cloneTree(root);
        const queue = [newRoot];

        while (queue.length > 0) {
            const node = queue.shift();

            if (!node.left) {
                node.left = new Node(value);
                return newRoot;
            } else {
                queue.push(node.left);
            }

            if (!node.right) {
                node.right = new Node(value);
                return newRoot;
            } else {
                queue.push(node.right);
            }
        }
        return newRoot;
    };

    const handleInsert = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) return;

        setTree(prev => {
            if (treeType === 'bst') {
                return insertBST(prev, val);
            } else {
                return insertLevelOrder(prev, val);
            }
        });

        setInputValue('');
        setMessage(`Inserted ${val} into the ${treeType.toUpperCase()}.`);
    };

    const clearTree = () => {
        setTree(null);
        setMessage('Tree cleared.');
    };

    const traverse = async (type) => {
        if (!tree || isAnimating) return;
        setIsAnimating(true);
        const order = [];
        
        const walk = (node) => {
            if (!node) return;
            if (type === 'pre') order.push(node);
            walk(node.left);
            if (type === 'in') order.push(node);
            walk(node.right);
            if (type === 'post') order.push(node);
        };

        walk(tree);
        setMessage(`${type.toUpperCase()}order Traversal started...`);

        // Save to history
        saveToHistory(`Tree: ${type.toUpperCase()}order`, 'tree', type, { treeType });

        for (const node of order) {
            setHighlightedNode(node.id);
            await new Promise(r => setTimeout(r, speed));
        }

        setHighlightedNode(null);
        setIsAnimating(false);
        setMessage(`${type.toUpperCase()}order Traversal completed.`);
    };

    const TreeNode = ({ node, x, y, level }) => {
        if (!node) return null;

        const offset = 180 / (level + 1);

        return (
            <g>
                {node.left && (
                    <line 
                        x1={x} y1={y} 
                        x2={x - offset} y2={y + 80} 
                        className="tree-edge" 
                    />
                )}
                {node.right && (
                    <line 
                        x1={x} y1={y} 
                        x2={x + offset} y2={y + 80} 
                        className="tree-edge" 
                    />
                )}
                <circle 
                    cx={x} cy={y} r="22" 
                    className={`tree-node ${highlightedNode === node.id ? 'highlighted' : ''}`} 
                />
                <text x={x} y={y} dy="5" textAnchor="middle" className="tree-text">
                    {node.value}
                </text>
                <TreeNode node={node.left} x={x - offset} y={y + 80} level={level + 1} />
                <TreeNode node={node.right} x={x + offset} y={y + 80} level={level + 1} />
            </g>
        );
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Tree Visualizer</h1>
                <p>Build and explore {treeType === 'bst' ? 'Binary Search Trees' : 'Binary Trees'} with interactive traversal animations.</p>
            </header>

            <div className="tree-dashboard">
                <div className="controls panel">
                    <h2>Configuration</h2>
                    
                    <div className="ds-mode-selector" style={{ marginBottom: '20px' }}>
                        <button 
                            className={`btn ${treeType === 'bst' ? 'active' : ''}`}
                            onClick={() => { setTreeType('bst'); clearTree(); }}
                        >
                            BST
                        </button>
                        <button 
                            className={`btn ${treeType === 'binary' ? 'active' : ''}`}
                            onClick={() => { setTreeType('binary'); clearTree(); }}
                        >
                            Binary Tree
                        </button>
                    </div>

                    <div className="input-group">
                        <input 
                            type="number" 
                            placeholder="Value" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                        />
                        <button className="btn success" onClick={handleInsert}>
                            <Plus size={18} /> Insert
                        </button>
                    </div>

                    <div className="action-grid">
                        <button className="btn outline" onClick={() => traverse('pre')} disabled={isAnimating || !tree}>
                            Pre-order
                        </button>
                        <button className="btn outline" onClick={() => traverse('in')} disabled={isAnimating || !tree}>
                            In-order
                        </button>
                        <button className="btn outline" onClick={() => traverse('post')} disabled={isAnimating || !tree}>
                            Post-order
                        </button>
                        <button className="btn danger" onClick={clearTree}>
                            <RotateCcw size={18} /> Clear
                        </button>
                    </div>
                </div>

                <div className="visualization panel">
                    <div className="ds-message-box">{message}</div>
                    <div className="svg-container">
                        <svg width="100%" height="500" viewBox="0 0 800 500">
                            <TreeNode node={tree} x={400} y={50} level={0} />
                        </svg>
                        {!tree && (
                            <div className="empty-tree">
                                <GitBranch size={48} opacity={0.2} />
                                <span>No nodes found. Add a root node to begin.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeVisualizer;
