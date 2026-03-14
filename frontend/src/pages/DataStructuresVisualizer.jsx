import React, { useState } from 'react';
import '../App.css';
import './DataStructures.css';
import { Layers, Plus, Minus, RotateCcw } from 'lucide-react';
import { saveToHistory } from '../utils/helpers';

const MAX_CAPACITY = 10;

const DataStructuresVisualizer = () => {
    const [mode, setMode] = useState('stack'); // 'stack' or 'queue'
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState('Select a mode and start adding elements.');
    
    // Animation states
    const [animatingIndex, setAnimatingIndex] = useState(null);
    const [animatingType, setAnimatingType] = useState(null); // 'add' or 'remove'

    const handleModeSwitch = (newMode) => {
        setMode(newMode);
        setItems([]);
        setMessage(`Switched to ${newMode.toUpperCase()} mode. Data cleared.`);
    };

    const addElement = () => {
        const val = inputValue.trim();
        if (!val) {
            setMessage('Please enter a value to insert.');
            return;
        }
        if (items.length >= MAX_CAPACITY) {
            setMessage(`Capacity reached! Maximum ${MAX_CAPACITY} elements allowed.`);
            return;
        }

        const newItem = { id: Date.now(), value: val };
        
        let newItems;
        if (mode === 'stack') {
            // Push to top (end of array)
            newItems = [...items, newItem];
            setMessage(`Pushed '${val}' onto the Stack.`);
        } else {
            // Enqueue to back (end of array)
            newItems = [...items, newItem];
            setMessage(`Enqueued '${val}' to the Queue.`);
        }
        
        setItems(newItems);
        
        // Save to history
        saveToHistory(`DS: ${mode.toUpperCase()} ${val}`, 'datastructures', mode, { mode, value: val });

        setAnimatingIndex(newItems.length - 1); // Last element added
        setAnimatingType('add');
        setInputValue('');
        
        setTimeout(() => setAnimatingType(null), 500);
    };

    const removeElement = () => {
        if (items.length === 0) {
            setMessage(`Cannot remove. The ${mode} is empty!`);
            return;
        }

        let removeIdx;
        if (mode === 'stack') {
            // Pop from top (end of array)
            removeIdx = items.length - 1;
            setMessage(`Popped '${items[removeIdx].value}' from the Stack.`);
        } else {
            // Dequeue from front (beginning of array)
            removeIdx = 0;
            setMessage(`Dequeued '${items[removeIdx].value}' from the Queue.`);
        }

        setAnimatingIndex(removeIdx);
        setAnimatingType('remove');

        setTimeout(() => {
            setItems(prev => {
                const newArr = [...prev];
                if (mode === 'stack') {
                    newArr.pop();
                } else {
                    newArr.shift();
                }
                return newArr;
            });
            setAnimatingType(null);
            setAnimatingIndex(null);
        }, 400); // Wait for fade out animation
    };

    const resetStructure = () => {
        setItems([]);
        setMessage('Data structure cleared.');
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Data Structures Visualizer</h1>
                <p>Interact with memory models representing Stacks (LIFO) and Queues (FIFO).</p>
            </header>
            
            <div className="ds-dashboard">
                <div className="ds-controls panel">
                    <h2>Configuration</h2>
                    <div className="ds-mode-selector">
                        <button 
                            className={`btn ${mode === 'stack' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('stack')}
                        >
                            Stack (LIFO)
                        </button>
                        <button 
                            className={`btn ${mode === 'queue' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('queue')}
                        >
                            Queue (FIFO)
                        </button>
                    </div>

                    <div className="ds-input-group">
                        <input
                            type="text"
                            placeholder="Enter a value"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addElement()}
                            maxLength={8}
                        />
                        <button className="btn success" onClick={addElement}>
                            <Plus size={18} /> {mode === 'stack' ? 'Push' : 'Enqueue'}
                        </button>
                    </div>

                    <div className="ds-action-group">
                        <button className="btn danger" onClick={removeElement} disabled={items.length === 0}>
                            <Minus size={18} /> {mode === 'stack' ? 'Pop' : 'Dequeue'}
                        </button>
                        <button className="btn info" onClick={resetStructure} disabled={items.length === 0}>
                            <RotateCcw size={18} /> Clear
                        </button>
                    </div>
                </div>

                <div className="ds-visualization panel">
                    <div className={`ds-message-box ${animatingType ? 'pulsing' : ''}`}>
                        {message}
                    </div>

                    <div className="ds-container-wrapper">
                        {/* Container looks different if it's a stack (vertical) vs queue (horizontal) */}
                        <div className={`ds-container ${mode}`}>
                            {items.length === 0 && (
                                <div className="ds-empty-state">
                                    <Layers size={48} opacity={0.3} />
                                    <span>Empty {mode}</span>
                                </div>
                            )}

                            {mode === 'stack' ? (
                                // For stack, visually we want the "top" to correspond to the end of the array,
                                // rendering it from top to bottom requires reversing the map flow or CSS
                                [...items].reverse().map((item, reverseIdx) => {
                                    const actualIdx = items.length - 1 - reverseIdx;
                                    const isAnimating = animatingIndex === actualIdx;
                                    const animClass = isAnimating ? `anim-${animatingType}-stack` : '';
                                    
                                    return (
                                        <div key={item.id} className={`ds-item ${animClass}`}>
                                            <span className="ds-index">Top - {actualIdx}</span>
                                            <span className="ds-value">{item.value}</span>
                                        </div>
                                    )
                                })
                            ) : (
                                // For Queue, standard left to right mapping
                                items.map((item, actualIdx) => {
                                    const isAnimating = animatingIndex === actualIdx;
                                    const animClass = isAnimating ? `anim-${animatingType}-queue` : '';
                                    
                                    return (
                                        <div key={item.id} className={`ds-item ${animClass}`}>
                                            <span className="ds-index">
                                                {actualIdx === 0 ? 'Front' : actualIdx === items.length - 1 ? 'Rear' : actualIdx}
                                            </span>
                                            <span className="ds-value">{item.value}</span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataStructuresVisualizer;
