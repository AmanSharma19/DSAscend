import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Code2, Play, Zap, TerminalSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';
import { generateRandomArray, delay } from '../utils/helpers';
import Visualizer from './Visualizer';
import './HomeCompiler.css';

const HomeCompiler = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const navigate = useNavigate();
    const location = useLocation();

    // Preview state
    const [showPreview, setShowPreview] = useState(false);
    const [array, setArray] = useState([]);
    const [comparing, setComparing] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [message, setMessage] = useState('');
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [vizMode, setVizMode] = useState('bars'); // 'bars', 'tree', 'table'
    const [treeRoot, setTreeRoot] = useState(null);
    const [tableData, setTableData] = useState([]);
    
    // Extracted algorithm details
    const [detectedAlgo, setDetectedAlgo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [detectedLang, setDetectedLang] = useState('');

    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (location.state?.restoredData) {
            const { code: restoredCode, language: restoredLang } = location.state.restoredData;
            if (restoredCode) setCode(restoredCode);
            if (restoredLang) setLanguage(restoredLang);
        }
    }, [location.state]);

    const detectLanguage = (snippet) => {
        const triggers = {
            python: ['def ', 'import ', 'print(', 'range(', '# ', ':', 'for i in'],
            java: ['public class', 'static void', 'System.out', 'String[] args', 'boolean ', 'int[]'],
            cpp: ['#include', 'std::', 'vector<', 'cout <<', 'cin >>', 'int main('],
            javascript: ['const ', 'let ', 'function ', '=>', 'console.log', 'var ']
        };

        const scores = { python: 0, java: 0, cpp: 0, javascript: 0 };
        
        Object.keys(triggers).forEach(lang => {
            triggers[lang].forEach(term => {
                if (snippet.includes(term)) scores[lang] += 1;
            });
        });

        const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        return scores[winner] > 0 ? winner : 'javascript';
    };

    const executeUserJS = (userCode, initialArray) => {
        const steps = [];
        const arrayCopy = [...initialArray];
        
        // Record initial state
        steps.push({
            array: [...arrayCopy],
            comparing: [],
            swapping: [],
            sorted: [],
            message: "Initial array state"
        });

        try {
            // Extract the function name from user code
            const functionMatch = userCode.match(/function\s+(\w+)/);
            let functionName = functionMatch ? functionMatch[1] : null;
            
            if (!functionName) {
                const constMatch = userCode.match(/const\s+(\w+)\s*=\s*/);
                functionName = constMatch ? constMatch[1] : null;
            }

            // Create array with custom setters for tracking
            const trackedArray = new Proxy(arrayCopy, {
                set(target, property, value) {
                    const index = parseInt(property);
                    if (!isNaN(index)) {
                        target[index] = value;
                        steps.push({
                            array: [...target],
                            comparing: [],
                            swapping: [index],
                            sorted: [],
                            message: `[Live View] Updated index ${index} to ${value}`
                        });
                    } else {
                        target[property] = value;
                    }
                    return true;
                },
                get(target, property) {
                    // We could track gets for "comparing" state if needed
                    return target[property];
                }
            });

            // Sandbox execution
            const sandbox = `
                ${userCode}
                
                // Helper to call the user's function if needed
                const fnName = "${functionName}";
                if (typeof window !== 'undefined' && typeof window[fnName] === 'function') window[fnName](arr);
                else if (typeof eval(fnName) === 'function') eval(fnName)(arr);
                else {
                    const firstFunc = \`${userCode}\`.match(/function\\s+([\\w$]+)/);
                    if (firstFunc) {
                        try { eval(\`${userCode}; \${firstFunc[1]}(arr);\`); } catch(e) {}
                    }
                }

                // Return results for visualization
                let result = { type: 'bars', data: arr };
                if (typeof root !== 'undefined') result = { type: 'tree', data: root };
                else if (typeof tree !== 'undefined') result = { type: 'tree', data: tree };
                else if (typeof dp !== 'undefined') result = { type: 'table', data: dp };
                else if (typeof table !== 'undefined') result = { type: 'table', data: table };
                
                return result;
            `;

            const executeFn = new Function('arr', sandbox);
            const executionResult = executeFn(trackedArray);
            
            if (executionResult && executionResult.type === 'tree') {
                steps.push({ type: 'tree', data: executionResult.data, message: "Tree structure detected and rendered." });
            } else if (executionResult && executionResult.type === 'table') {
                steps.push({ type: 'table', data: executionResult.data, message: "DP table detected and rendered." });
            } else {
                // Record final state for sorting
                steps.push({
                    type: 'bars',
                    array: [...arrayCopy],
                    comparing: [],
                    swapping: [],
                    sorted: Array.from({length: arrayCopy.length}, (_, i) => i),
                    message: "User code execution finished."
                });
            }
            
            return steps;
        } catch (e) {
            console.error('Execution error:', e);
            steps.push({
                type: 'bars',
                array: [...arrayCopy],
                comparing: [],
                swapping: [],
                sorted: [],
                message: `Runtime Error: ${e.message}`
            });
            return steps;
        }
    };

    const getAlgorithmSteps = (algo, array) => {
        const algoDetails = SORTING_ALGORITHMS[algo];
        if (algoDetails && algoDetails.getSteps) {
            return algoDetails.getSteps([...array]);
        }
        return [];
    };

    const saveVisualizationHistory = async (type, algo, data) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch('http://localhost:5000/api/visualizations/save', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: `Visualized ${algo.charAt(0).toUpperCase() + algo.slice(1)} (${type.toUpperCase()})`,
                    type,
                    algo,
                    data,
                    language
                })
            });
        } catch (err) {
            console.error('Failed to save history', err);
        }
    };

    const handleVisualize = async () => {
        if (!code.trim()) return;

        // Auto-detect algorithm based on keywords
        const lowerCode = code.toLowerCase();
        let algo = 'bubble';
        let type = 'sorting';

        if (lowerCode.includes('dijkstra') || lowerCode.includes('a*') || lowerCode.includes('astar') || lowerCode.includes('bfs') || lowerCode.includes('path') || lowerCode.includes('graph')) {
            type = 'pathfinding';
            algo = lowerCode.includes('dijkstra') ? 'dijkstra' 
                 : (lowerCode.includes('a*') || lowerCode.includes('astar')) ? 'astar' 
                 : lowerCode.includes('bfs') ? 'bfs' 
                 : 'dijkstra';
        } else if (lowerCode.includes('merge')) {
            algo = 'merge';
        } else if (lowerCode.includes('quick') || lowerCode.includes('pivot')) {
            algo = 'quick';
        } else if (lowerCode.includes('insertion')) {
            algo = 'insertion';
        } else if (lowerCode.includes('selection')) {
            algo = 'selection';
        } else if (lowerCode.includes('bubble') || lowerCode.includes('j+1') || lowerCode.includes('range(n-i-1)')) {
            algo = 'bubble';
        }

        // Tree detection
        const isTree = lowerCode.includes('node') && (lowerCode.includes('left') || lowerCode.includes('right') || lowerCode.includes('root') || lowerCode.includes('tree'));
        // DP detection
        const isDP = lowerCode.includes('memo') || lowerCode.includes('table') || lowerCode.includes('dp[') || lowerCode.includes('fibonacci') || lowerCode.includes('lcs');
        // Linear DS detection
        const isLL = lowerCode.includes('next') && (lowerCode.includes('head') || lowerCode.includes('node') || lowerCode.includes('list'));
        const isStack = lowerCode.includes('stack') || (lowerCode.includes('push') && !lowerCode.includes('bubble') && !lowerCode.includes('sort') && !lowerCode.includes('array'));
        const isQueue = (lowerCode.includes('queue') || lowerCode.includes('enqueue')) && !lowerCode.includes('priority');

        const actualLang = detectLanguage(code);
        if (actualLang !== language) {
            setErrorMsg(`Language mismatch! Error: Snippet detected as ${actualLang.toUpperCase()}, but ${language.toUpperCase()} is selected. Please change language to run.`);
            return;
        }

        setErrorMsg('');
        setDetectedAlgo(algo);

        if (type === 'pathfinding') {
            localStorage.setItem('sharedCustomCode', code);
            localStorage.setItem('sharedCustomLang', language);
            navigate(`/pathfinding?algo=${algo}`);
            return;
        }

        stopVisualizing();
        
        let initialArray = [];
        let usedCodeArray = false;

        // Smart Extraction: Extract from code
        // 1. Hardcoded arrays
        const arrayMatch = code.match(/\[([\d\s,.]+)\]|\{([\d\s,.]+)\}/);
        if (arrayMatch) {
            const values = (arrayMatch[1] || arrayMatch[2])
                .split(',')
                .map(v => parseInt(v.trim(), 10))
                .filter(v => !isNaN(v));
            if (values.length > 2) {
                initialArray = values;
                usedCodeArray = true;
            }
        }

        // 2. Sequential values (e.g., insertAtEnd(head, 10), push(20), root = new Node(30))
        if (initialArray.length === 0) {
            // Updated regex: allows alphanumeric characters before/after the keyword (e.g., insertAtEnd)
            const seqRegex = /(?:\w*insert\w*|\w*push\w*|\w*enqueue\w*|\w*add\w*|node|root)\s*\(\s*(?:[^,\)]*,)?\s*(\d+)/gi;
            let match;
            const seqValues = [];
            
            // We need to reset lastIndex because of 'g' flag if we were reusing regex, but here it's local
            while ((match = seqRegex.exec(code)) !== null) {
                if (match[1]) {
                    seqValues.push(parseInt(match[1], 10));
                }
            }
            
            if (seqValues.length > 0) {
                initialArray = seqValues;
                usedCodeArray = true;
            }
        }

        // Fallback to random if nothing extracted
        if (initialArray.length === 0) {
            initialArray = generateRandomArray(8, 10, 100);
        }

        setArray(initialArray);
        setShowPreview(true);
        setComparing([]);
        setSorted([]);
        setSwapping([]);

        const displayMsg = usedCodeArray ? 'Using array extracted from your code...' : 'Generating random array for visualization...';
        setMessage(displayMsg);

        // Save to history
        saveVisualizationHistory(
            isTree ? 'tree' : isDP ? 'dp' : isLL ? 'list' : isStack ? 'stack' : isQueue ? 'queue' : 'sorting',
            isTree ? 'BST' : isDP ? 'Dynamic Programming' : isLL ? 'Linked List' : isStack ? 'Stack' : isQueue ? 'Queue' : algo,
            { code, initialArray }
        );

        await delay(1000);

        let steps = [];
        if (language === 'javascript') {
            steps = executeUserJS(code, initialArray);
        } else {
            if (isTree) {
                // Simulate Tree Build
                let simRoot = null;
                const buildBST = (node, val) => {
                    if (!node) return { value: val, left: null, right: null };
                    if (val < node.value) node.left = buildBST(node.left, val);
                    else if (val > node.value) node.right = buildBST(node.right, val);
                    return node;
                };

                for (let i = 0; i < Math.min(initialArray.length, 10); i++) {
                    simRoot = buildBST(simRoot ? JSON.parse(JSON.stringify(simRoot)) : null, initialArray[i]);
                    steps.push({
                        type: 'tree',
                        data: simRoot,
                        message: `[${language.toUpperCase()} Simulation] Inserting ${initialArray[i]}...`
                    });
                }
            } else if (isDP) {
                // Simulate DP Table
                let dp = Array(8).fill(0);
                for (let i = 0; i < 8; i++) {
                    if (i <= 1) dp[i] = i; else dp[i] = dp[i-1] + dp[i-2];
                    steps.push({
                        type: 'table',
                        data: [...dp],
                        message: `[${language.toUpperCase()} Simulation] Computing DP state for ${i}...`
                    });
                }
            } else if (isLL || isStack || isQueue) {
                // Simulate Linear DS
                let items = [];
                const dsType = isStack ? 'stack' : isQueue ? 'queue' : 'list';
                for (let i = 0; i < initialArray.length; i++) {
                    items.push(initialArray[i]);
                    steps.push({
                        type: dsType,
                        data: [...items],
                        message: `[${language.toUpperCase()} Simulation] ${isStack ? 'Pushing' : isQueue ? 'Enqueuing' : 'Adding'} ${initialArray[i]}...`
                    });
                }
            } else {
                steps = getAlgorithmSteps(algo, initialArray);
                if (steps.length > 0) {
                    steps[0].message = `[${language.toUpperCase()} Simulation] Running identified ${algo} sort...`;
                }
            }
        }

        if (steps.length > 0) {
            runPreview(steps);
        } else {
            setMessage('Analysis complete. No execution patterns detected.');
        }
    };

    const stopVisualizing = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsVisualizing(false);
    };

    const runPreview = async (steps) => {
        setIsVisualizing(true);
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            for (let i = 0; i < steps.length; i++) {
                if (signal.aborted) throw new Error('Stopped');
                
                const step = steps[i];
                if (step.type === 'tree') {
                    setVizMode('tree');
                    setTreeRoot(step.data);
                } else if (step.type === 'table') {
                    setVizMode('table');
                    setTableData(step.data);
                } else if (step.type === 'stack' || step.type === 'queue' || step.type === 'list') {
                    setVizMode(step.type);
                    setArray([...step.data]);
                } else {
                    setVizMode('bars');
                    setArray([...step.array]);
                    setComparing(step.comparing || []);
                    setSorted(step.sorted || []);
                    setSwapping(step.swapping || []);
                }
                
                setMessage(step.message || `Phase ${i + 1}`);
                await delay(800);
            }
            setMessage('Visualization Completed Successfully.');
        } catch (error) {
            if (error.message !== 'Stopped') console.error('Visualizer Error:', error);
        } finally {
            setIsVisualizing(false);
        }
    };

    const jumpToFullEnvironment = () => {
        localStorage.setItem('sharedCustomCode', code);
        localStorage.setItem('sharedCustomLang', language);
        navigate(`/sorting?algo=${detectedAlgo || 'bubble'}`);
    };

    useEffect(() => {
        return () => stopVisualizing();
    }, []);

    return (
        <section className="home-compiler-section">
            <div className="compiler-header">
                <h2><Zap size={28} className="icon-amber" /> Smart Auto-Compiler</h2>
                <p>Paste your algorithm code below in any supported language. Our engine will automatically understand your code, detect the algorithm, and visualize its execution instantly!</p>
            </div>
            
            <div className="compiler-panel">
                <div className="panel-header">
                    <h3><Code2 size={20} className="icon-blue" /> Code Editor</h3>
                    <div className="language-selector">
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="lang-dropdown"
                            disabled={isVisualizing}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                    </div>
                </div>

                {errorMsg && (
                    <div className="compiler-error">
                        <AlertCircle size={16} /> {errorMsg}
                    </div>
                )}
                
                <div className="editor-container">
                    {detectedLang && detectedLang !== language && code.trim() && (
                        <div className="language-badge-overlay">
                            <AlertCircle size={14} /> Warning: Detected {detectedLang.toUpperCase()}
                        </div>
                    )}
                    <div className="line-numbers">
                        {(code || '\n').split('\n').map((_, index) => (
                            <div key={index} className="line-number">{index + 1}</div>
                        ))}
                    </div>
                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) => {
                            const newCode = e.target.value;
                            setCode(newCode);
                            if (newCode.trim()) {
                                setDetectedLang(detectLanguage(newCode));
                            } else {
                                setDetectedLang('');
                            }
                        }}
                        placeholder={`// Paste your algorithm here...\n// Example:\nfunction bubbleSort(arr) {\n    for(let i=0; i<arr.length; i++) {\n        for(let j=0; j<arr.length-i-1; j++) {\n            if(arr[j] > arr[j+1]) {\n                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n            }\n        }\n    }\n}`}
                        spellCheck="false"
                    />
                </div>
                
                <div className="panel-footer" style={{ justifyContent: 'center' }}>
                    <button 
                        className="visualize-btn pulse-glow"
                        onClick={handleVisualize}
                        disabled={!code.trim() || isVisualizing}
                        style={{ width: '100%' }}
                    >
                        <Play size={18} className="play-icon" /> 
                        {isVisualizing ? 'Visualizing...' : 'Auto-Detect & Visualize'}
                    </button>
                </div>
            </div>

            {showPreview && (
                <div className="preview-panel">
                    <div className="preview-header">
                        <h3><TerminalSquare size={20} className="icon-emerald" /> Output Visualization</h3>
                        <button 
                            className="btn-open-full"
                            onClick={jumpToFullEnvironment}
                            disabled={isVisualizing}
                        >
                            Open in Full Visualizer <ExternalLink size={16} />
                        </button>
                    </div>
                    
                    <div className="preview-visualizer-container">
                        {vizMode === 'bars' && (
                            <Visualizer 
                                array={array}
                                comparing={comparing}
                                sorted={sorted}
                                swapping={swapping}
                                message={message}
                            />
                        )}

                        {vizMode === 'tree' && treeRoot && (
                            <div className="preview-tree-container">
                                <svg width="100%" height="300" viewBox="0 0 800 300">
                                    <TreeNode node={treeRoot} x={400} y={40} level={0} />
                                </svg>
                                <div className="viz-message">{message}</div>
                            </div>
                        )}

                        {vizMode === 'table' && tableData.length > 0 && (
                            <div className="preview-table-container">
                                <table className="mini-dp-table">
                                    <tbody>
                                        {(Array.isArray(tableData[0]) ? tableData : [tableData]).map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j} className={cell > 0 ? 'filled' : ''}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="viz-message">{message}</div>
                            </div>
                        )}

                        {vizMode === 'list' && (
                            <div className="preview-list-container">
                                <div className="mini-list">
                                    {array.map((val, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="list-node">{val}</div>
                                            {idx < array.length - 1 && <div className="list-arrow">→</div>}
                                        </React.Fragment>
                                    ))}
                                    <div className="list-node null">null</div>
                                </div>
                                <div className="viz-message">{message}</div>
                            </div>
                        )}

                        {(vizMode === 'stack' || vizMode === 'queue') && (
                            <div className="preview-linear-container">
                                <div className={`mini-container ${vizMode}`}>
                                    {array.map((val, idx) => (
                                        <div key={idx} className="ds-cell">{val}</div>
                                    ))}
                                </div>
                                <div className="viz-message">{message}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

// Internal mini-renderer for Tree
const TreeNode = ({ node, x, y, level }) => {
    if (!node) return null;
    const offset = 140 / (level + 1);
    return (
        <g>
            {node.left && <line x1={x} y1={y} x2={x - offset} y2={y + 60} stroke="rgba(255,255,255,0.2)" />}
            {node.right && <line x1={x} y1={y} x2={x + offset} y2={y + 60} stroke="rgba(255,255,255,0.2)" />}
            <circle cx={x} cy={y} r="15" fill="#3b82f6" opacity="0.8" />
            <text x={x} y={y} dy="5" textAnchor="middle" fill="white" fontSize="10">{node.value}</text>
            <TreeNode node={node.left} x={x - offset} y={y + 60} level={level + 1} />
            <TreeNode node={node.right} x={x + offset} y={y + 60} level={level + 1} />
        </g>
    );
};

export default HomeCompiler;