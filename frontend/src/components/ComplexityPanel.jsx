import React from 'react';
import { SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';
import './ComplexityPanel.css';
import { BookOpen, Clock, HardDrive } from 'lucide-react';

const ComplexityPanel = ({ algorithm }) => {
    const algoDetails = SORTING_ALGORITHMS[algorithm];

    return (
        <div className="complexity-panel">
            <div className="panel-section info-section">
                <h3>
                    <BookOpen size={20} className="icon" />
                    {algoDetails.name} Info
                </h3>
                <p>{algoDetails.description}</p>
            </div>
            
            <div className="metrics-container">
                <div className="panel-section table-section">
                    <h3>
                        <Clock size={20} className="icon" />
                        Time Complexity
                    </h3>
                    <div className="complexity-grid">
                        <div className="grid-item">
                            <span className="label">Best Case</span>
                            <span className={`value ${algoDetails.timeComplexity.best === 'O(n)' ? 'good' : 'average'}`}>
                                {algoDetails.timeComplexity.best}
                            </span>
                        </div>
                        <div className="grid-item">
                            <span className="label">Average Case</span>
                            <span className={`value ${['O(n log n)', 'O(n)'].includes(algoDetails.timeComplexity.average) ? 'good' : 'warning'}`}>
                                {algoDetails.timeComplexity.average}
                            </span>
                        </div>
                        <div className="grid-item">
                            <span className="label">Worst Case</span>
                            <span className={`value ${['O(n log n)', 'O(n)'].includes(algoDetails.timeComplexity.worst) ? 'good' : 'bad'}`}>
                                {algoDetails.timeComplexity.worst}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="panel-section space-section">
                    <h3>
                        <HardDrive size={20} className="icon" />
                        Space Complexity
                    </h3>
                    <div className="complexity-grid">
                        <div className="grid-item space-item">
                            <span className="label">Worst Case</span>
                            <span className={`value ${algoDetails.spaceComplexity === 'O(1)' ? 'good' : 'warning'}`}>
                                {algoDetails.spaceComplexity}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplexityPanel;
