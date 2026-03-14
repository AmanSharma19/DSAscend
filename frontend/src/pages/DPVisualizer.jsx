import React, { useState } from 'react';
import './DPVisualizer.css';
import { Table, Play, RotateCcw } from 'lucide-react';
import { delay, saveToHistory } from '../utils/helpers';

const DPVisualizer = () => {
    const [problem, setProblem] = useState('fib'); // 'fib' or 'lcs'
    const [n, setN] = useState(8);
    const [s1, setS1] = useState('ABCBDAB');
    const [s2, setS2] = useState('BDCABA');
    const [table, setTable] = useState([]);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [currentCells, setCurrentCells] = useState([]);
    const [message, setMessage] = useState('Select a problem and watch the DP table fill up.');

    const runFib = async () => {
        setIsVisualizing(true);
        const dp = Array(n + 1).fill(0);
        setTable([dp]);
        setCurrentCells([]);
        saveToHistory(`DP: Fibonacci(${n})`, 'dp', 'fib', { n });

        setMessage(`Computing Fibonacci(${n}) with Tabulation...`);
        for (let i = 0; i <= n; i++) {
            setCurrentCells([[0, i]]);
            if (i <= 1) dp[i] = i;
            else dp[i] = dp[i - 1] + dp[i - 2];
            
            setTable([[...dp]]);
            await delay(600);
        }
        setCurrentCells([]);
        setMessage(`Fibonacci(${n}) = ${dp[n]}`);
        setIsVisualizing(false);
    };

    const runLCS = async () => {
        setIsVisualizing(true);
        const rows = s1.length + 1;
        const cols = s2.length + 1;
        const dp = Array.from({ length: rows }, () => Array(cols).fill(0));
        setTable([...dp]);
        saveToHistory(`DP: LCS '${s1}' vs '${s2}'`, 'dp', 'lcs', { s1, s2 });

        setMessage(`Computing Longest Common Subsequence of '${s1}' and '${s2}'...`);
        
        for (let i = 1; i < rows; i++) {
            for (let j = 1; j < cols; j++) {
                setCurrentCells([[i, j], [i-1, j], [i, j-1]]);
                
                if (s1[i-1] === s2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
                
                setTable(dp.map(row => [...row]));
                await delay(400);
            }
        }
        setCurrentCells([]);
        setMessage(`LCS Length: ${dp[rows-1][cols-1]}`);
        setIsVisualizing(false);
    };

    const reset = () => {
        setTable([]);
        setCurrentCells([]);
        setMessage('Table reset.');
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Dynamic Programming Visualizer</h1>
                <p>Observe sub-problem resolution through interactive table-filling animations.</p>
            </header>

            <div className="dp-dashboard">
                <div className="controls panel">
                    <h2>Problem Selector</h2>
                    <div className="ds-mode-selector">
                        <button 
                            className={`btn ${problem === 'fib' ? 'active' : ''}`}
                            onClick={() => { setProblem('fib'); reset(); }}
                        >
                            Fibonacci
                        </button>
                        <button 
                            className={`btn ${problem === 'lcs' ? 'active' : ''}`}
                            onClick={() => { setProblem('lcs'); reset(); }}
                        >
                            LCS
                        </button>
                    </div>

                    <div className="dp-inputs">
                        {problem === 'fib' ? (
                            <div className="input-group">
                                <label>N:</label>
                                <input type="number" value={n} onChange={(e) => setN(parseInt(e.target.value))} />
                            </div>
                        ) : (
                            <>
                                <div className="input-group">
                                    <label>S1:</label>
                                    <input type="text" value={s1} onChange={(e) => setS1(e.target.value.toUpperCase())} maxLength={8} />
                                </div>
                                <div className="input-group">
                                    <label>S2:</label>
                                    <input type="text" value={s2} onChange={(e) => setS2(e.target.value.toUpperCase())} maxLength={8} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="action-grid">
                        <button 
                            className="btn success" 
                            onClick={problem === 'fib' ? runFib : runLCS}
                            disabled={isVisualizing}
                        >
                            <Play size={18} /> Run Visualization
                        </button>
                        <button className="btn info" onClick={reset}>
                            <RotateCcw size={18} /> Reset
                        </button>
                    </div>
                </div>

                <div className="visualization panel">
                    <div className="ds-message-box">{message}</div>
                    <div className="dp-grid-container">
                        {table.length > 0 ? (
                            <div className="dp-table-wrapper">
                                <table className="dp-table">
                                    {problem === 'lcs' && (
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Ø</th>
                                                {s2.split('').map((char, i) => <th key={i}>{char}</th>)}
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                        {table.map((row, i) => (
                                            <tr key={i}>
                                                {problem === 'lcs' && <th>{i === 0 ? 'Ø' : s1[i-1]}</th>}
                                                {row.map((cell, j) => {
                                                    const isCurrent = currentCells.some(([ci, cj]) => ci === i && cj === j);
                                                    return (
                                                        <td key={j} className={isCurrent ? 'current' : cell > 0 ? 'filled' : ''}>
                                                            {cell}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Table size={48} opacity={0.2} />
                                <span>Table not initialized. Fill inputs and click Run.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DPVisualizer;
