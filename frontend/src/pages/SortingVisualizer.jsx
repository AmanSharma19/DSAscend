import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';
import Visualizer from '../components/Visualizer';
import Controls from '../components/Controls';
import ComplexityPanel from '../components/ComplexityPanel';
import { generateRandomArray, delay, saveToHistory } from '../utils/helpers';
import { SORTING_ALGORITHMS } from '../algorithms/sortingAlgorithms';

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [comparing, setComparing] = useState([]);
    const [sorted, setSorted] = useState([]);
    const [swapping, setSwapping] = useState([]);
    const [message, setMessage] = useState('');
    
    const [searchParams] = useSearchParams();
    const initialAlgo = searchParams.get('algo') || 'bubble';
    const [algorithm, setAlgorithm] = useState(SORTING_ALGORITHMS[initialAlgo] ? initialAlgo : 'bubble');
    
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(150);
    const [arraySize, setArraySize] = useState(15);
    const [customInput, setCustomInput] = useState('');
    
    const [steps, setSteps] = useState([]);
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    
    const abortControllerRef = useRef(null);

    useEffect(() => {
        generateNewArray();
        // eslint-disable-next-line
    }, [arraySize, algorithm]);

    const generateNewArray = () => {
        if (isSorting) return;
        const newArray = generateRandomArray(arraySize, 10, 100);
        setCustomInput(newArray.join(', '));
        setupSteps(newArray, algorithm);
    };

    const handleCustomInputSubmit = () => {
        if (isSorting) return;
        const parsedArray = customInput.split(',')
            .map(val => parseInt(val.trim(), 10))
            .filter(val => !isNaN(val));
        
        if (parsedArray.length > 0) {
            setupSteps(parsedArray, algorithm);
        } else {
            generateNewArray();
        }
    };


    const setupSteps = (initialArray, algoKey) => {
        stopSorting();
        const algo = SORTING_ALGORITHMS[algoKey];
        const generatedSteps = algo.getSteps(initialArray);
        setSteps(generatedSteps);
        setCurrentStepIdx(0);
        applyStep(generatedSteps[0]);
    };


    const applyStep = (step) => {
        if (!step) return;
        setArray([...step.array]);
        setComparing([...step.comparing]);
        setSorted([...step.sorted]);
        setSwapping([...step.swapping]);
        setMessage(step.message || '');
    };

    const stopSorting = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsSorting(false);
    };

    const playSorting = async () => {
        if (isSorting) return;
        
        let startIdx = currentStepIdx;
        if (currentStepIdx >= steps.length - 1) {
            startIdx = 0;
            setCurrentStepIdx(0);
        }
        
        setIsSorting(true);
        
        // Save to history when starting
        const algo = SORTING_ALGORITHMS[algorithm];
        saveToHistory(`Sorting: ${algo.name}`, 'sorting', algorithm, { array: array });

        abortControllerRef.current = new AbortController();

        const signal = abortControllerRef.current.signal;

        try {
            for (let i = startIdx; i < steps.length; i++) {
                if (signal.aborted) throw new Error('Stopped');
                setCurrentStepIdx(i);
                applyStep(steps[i]);
                await delay(2000 - speed);
            }
        } catch (error) {
            if (error.message === 'Stopped') {
                console.log('Sorting paused by user');
            } else {
                console.error('Error during sorting:', error);
            }
        } finally {
            setIsSorting(false);
        }
    };

    const stepForward = () => {
        if (isSorting) return;
        if (currentStepIdx < steps.length - 1) {
            const nextIdx = currentStepIdx + 1;
            setCurrentStepIdx(nextIdx);
            applyStep(steps[nextIdx]);
        }
    };

    const stepBackward = () => {
        if (isSorting) return;
        if (currentStepIdx > 0) {
            const prevIdx = currentStepIdx - 1;
            setCurrentStepIdx(prevIdx);
            applyStep(steps[prevIdx]);
        }
    };

    const progress = steps.length > 1 ? (currentStepIdx / (steps.length - 1)) * 100 : 0;

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Sorting Visualizer</h1>
                <p>Compare elements and array sorting behavior step-by-step.</p>
            </header>

            <Controls
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                generateNewArray={generateNewArray}
                playSorting={playSorting}
                stopSorting={stopSorting}
                stepForward={stepForward}
                stepBackward={stepBackward}
                isSorting={isSorting}
                speed={speed}
                setSpeed={setSpeed}
                arraySize={arraySize}
                setArraySize={setArraySize}
                customInput={customInput}
                setCustomInput={setCustomInput}
                handleCustomInputSubmit={handleCustomInputSubmit}
                progress={progress}
                currentStep={currentStepIdx}
                totalSteps={steps.length}
            />

            <Visualizer
                array={array}
                comparing={comparing}
                sorted={sorted}
                swapping={swapping}
                message={message}
            />

            <ComplexityPanel algorithm={algorithm} />
        </div>
    );
};

export default SortingVisualizer;
