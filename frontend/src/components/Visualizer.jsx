import React from 'react';
import './Visualizer.css';
import { Info } from 'lucide-react';

const Visualizer = ({ array, comparing, sorted, swapping, message }) => {
    // Determine the max value in the array to scale the bars properly. 
    // Usually it's ~100 with the random generator, 
    // but custom inputs might exceed it.
    const maxVal = Math.max(...array, 100);

    return (
        <div className="visualizer-wrapper">
            <div className={`message-panel ${message ? 'active' : ''}`}>
                <Info size={20} className="info-icon" />
                <p className="message-text">
                    {message || "Ready to sort. Press Play or Step Forward to begin."}
                </p>
            </div>

            <div className="visualizer-container">
                <div className="bars-container">
                    {array.map((value, idx) => {
                        let className = 'bar';
                        if (sorted.includes(idx)) {
                            className += ' sorted';
                        } else if (swapping.includes(idx)) {
                            className += ' swapping';
                        } else if (comparing.includes(idx)) {
                            className += ' comparing';
                        }

                        // Calculate height percentage relative to maxVal
                        const heightPercentage = Math.max(5, (value / maxVal) * 100);

                        return (
                            <div
                                key={idx}
                                className={className}
                                style={{
                                    height: `${heightPercentage}%`,
                                }}
                            >
                                <span className="bar-value">{value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Visualizer;
