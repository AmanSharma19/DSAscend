import React, { useState } from 'react';
import './CustomCodePanel.css';
import { Code2, Play, CheckCircle2 } from 'lucide-react';
import { SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';

const getBoilerplate = (lang, algoName) => {
    const name = algoName.replace(' ', '');
    switch (lang) {
        case 'python':
            return `def ${name.toLowerCase()}(arr):\n    # Write your custom ${algoName} implementation here\n    # e.g., for i in range(len(arr)):\n    #        ...\n    pass`;
        case 'cpp':
            return `#include <vector>\nusing namespace std;\n\nvoid ${name.toLowerCase()}(vector<int>& arr) {\n    // Write your custom ${algoName} implementation here\n    \n}`;
        case 'java':
            return `class Solution {\n    public void ${name.toLowerCase()}(int[] arr) {\n        // Write your custom ${algoName} implementation here\n        \n    }\n}`;
        case 'javascript':
        default:
            return `function ${name.toLowerCase()}(arr) {\n    // Write your custom ${algoName} implementation here\n    \n}`;
    }
};

const CustomCodePanel = ({ algorithm, playSorting, isSorting }) => {
    const aiDetectedLang = localStorage.getItem('sharedCustomLang') || 'javascript';
    const [language, setLanguage] = useState(aiDetectedLang);
    const algoDetails = SORTING_ALGORITHMS[algorithm];
    const [code, setCode] = useState(() => {
        const sharedCode = localStorage.getItem('sharedCustomCode');
        if (sharedCode) {
            localStorage.removeItem('sharedCustomCode');
            localStorage.removeItem('sharedCustomLang');
            return sharedCode;
        }
        return getBoilerplate(language, algoDetails.name);
    });
    const [prevKey, setPrevKey] = useState(`${algorithm}-${language}`);

    if (`${algorithm}-${language}` !== prevKey) {
        setPrevKey(`${algorithm}-${language}`);
        setCode(getBoilerplate(language, algoDetails.name));
    }

    return (
        <div className="custom-code-panel">
            <div className="panel-header">
                <h3>
                    <Code2 size={20} className="icon" />
                    Custom Implementation
                </h3>
                <div className="language-selector">
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang-dropdown"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </div>
            </div>
            
            <div className="editor-container">
                <div className="line-numbers">
                    {code.split('\n').map((_, index) => (
                        <div key={index} className="line-number">{index + 1}</div>
                    ))}
                </div>
                <textarea
                    className="code-editor"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                />
            </div>
            
            <div className="panel-footer">
                <button 
                    className="visualize-btn"
                    onClick={playSorting}
                    disabled={isSorting}
                >
                    {isSorting ? (
                        <>Visualizing...</>
                    ) : (
                        <>
                            <Play size={16} /> Visualize My Code
                        </>
                    )}
                </button>
                <div className="status-text">
                    <CheckCircle2 size={16} className="status-icon" />
                    <span>Linked to visualizer</span>
                </div>
            </div>
        </div>
    );
};

export default CustomCodePanel;
