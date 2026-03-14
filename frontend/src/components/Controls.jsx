import React from 'react';
import { SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';
import './Controls.css';
import { Play, RotateCcw, Pause, Settings, FastForward, StepBack, StepForward, Check } from 'lucide-react';

const Controls = ({
    algorithm,
    setAlgorithm,
    generateNewArray,
    playSorting,
    stopSorting,
    stepForward,
    stepBackward,
    isSorting,
    speed,
    setSpeed,
    arraySize,
    setArraySize,
    customInput,
    setCustomInput,
    handleCustomInputSubmit,
    progress,
    currentStep,
    totalSteps
}) => {
    return (
        <div className="controls-container">
            <div className="controls-top">
                <div className="controls-group">
                    <label>Algorithm Selection</label>
                    <div className="button-group algorithms">
                        {Object.entries(SORTING_ALGORITHMS).map(([key, algo]) => (
                            <button
                                key={key}
                                className={`btn ${algorithm === key ? 'active' : ''}`}
                                onClick={() => setAlgorithm(key)}
                                disabled={isSorting}
                            >
                                {algo.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="controls-group custom-input-group">
                    <label>Custom Array (e.g., 5, 23, 10, 2)</label>
                    <div className="input-row">
                        <input 
                            type="text" 
                            className="text-input"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            disabled={isSorting}
                            placeholder="Enter comma separated numbers"
                        />
                        <button 
                            className="btn primary icon-btn" 
                            onClick={handleCustomInputSubmit}
                            disabled={isSorting}
                            title="Apply Custom Array"
                        >
                            <Check size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="controls-bottom">
                 <div className="controls-group settings-group">
                    <div className="slider-container">
                        <label>Array Size: {arraySize}</label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={arraySize}
                            onChange={(e) => setArraySize(Number(e.target.value))}
                            disabled={isSorting}
                            className="slider"
                        />
                    </div>
                    
                    <div className="slider-container">
                        <label>Speed</label>
                        <input
                            type="range"
                            min="10"
                            max="1950"
                            step="10"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="slider"
                        />
                    </div>
                </div>

                <div className="controls-group player-group">
                    <div className="playback-controls">
                        <button className="btn icon-btn" onClick={stepBackward} disabled={isSorting || currentStep === 0} title="Previous Step">
                            <StepBack size={20} />
                        </button>
                        
                        {isSorting ? (
                             <button className="btn danger icon-btn large" onClick={stopSorting} title="Pause">
                                <Pause size={24} />
                             </button>
                        ) : (
                            <button className="btn success icon-btn large" onClick={playSorting} title="Play">
                                <Play size={24} />
                            </button>
                        )}

                        <button className="btn icon-btn" onClick={stepForward} disabled={isSorting || currentStep === totalSteps - 1} title="Next Step">
                            <StepForward size={20} />
                        </button>
                    </div>
                    
                    <button 
                        className="btn info action-btn" 
                        onClick={generateNewArray} 
                        disabled={isSorting}
                    >
                        <RotateCcw size={16} /> Randomize
                    </button>
                </div>
            </div>

            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                <div className="progress-text">Step {currentStep} of {totalSteps > 0 ? totalSteps - 1 : 0}</div>
            </div>

        </div>
    );
};

export default Controls;
