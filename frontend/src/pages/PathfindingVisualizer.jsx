import React, { useState, useEffect } from 'react';
import '../App.css';
import './Pathfinding.css';
import { Play, RotateCcw, MousePointer2, Eraser } from 'lucide-react';
import { saveToHistory } from '../utils/helpers';

const NUM_ROWS = 20;
const NUM_COLS = 50;

const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {
    return {
        col,
        row,
        isStart: row === startRow && col === startCol,
        isFinish: row === finishRow && col === finishCol,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        isPath: false,
    };
};

const getInitialGrid = (startRow, startCol, finishRow, finishCol) => {
    const grid = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            currentRow.push(createNode(col, row, startRow, startCol, finishRow, finishCol));
        }
        grid.push(currentRow);
    }
    return grid;
};

// BFS to find shortest path
const bfs = (grid, startNode, finishNode) => {
    const visitedNodesInOrder = [];
    let queue = [startNode];
    startNode.isVisited = true;

    while (queue.length > 0) {
        const closestNode = queue.shift();
        
        if (closestNode.isWall) continue;
        
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighbors(closestNode, grid, queue);
    }
    return visitedNodesInOrder;
};

const updateUnvisitedNeighbors = (node, grid, queue) => {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.isVisited = true;
        neighbor.previousNode = node;
        queue.push(neighbor);
    }
};

const getUnvisitedNeighbors = (node, grid) => {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
};

// Get shortest path backtracking
const getNodesInShortestPathOrder = (finishNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};


const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [draggingNode, setDraggingNode] = useState(null); // 'start', 'finish' or null
    const [isRunning, setIsRunning] = useState(false);

    // Dynamic start and finish nodes
    const [startNodePos, setStartNodePos] = useState({ row: 10, col: 10 });
    const [finishNodePos, setFinishNodePos] = useState({ row: 10, col: 40 });

    useEffect(() => {
        setGrid(getInitialGrid(startNodePos.row, startNodePos.col, finishNodePos.row, finishNodePos.col));
    }, []);

    const handleMouseDown = (row, col) => {
        if (isRunning) return;

        const node = grid[row][col];
        if (node.isStart) {
            setDraggingNode('start');
        } else if (node.isFinish) {
            setDraggingNode('finish');
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed || isRunning) return;

        if (draggingNode === 'start') {
            const newGrid = grid.map(r => [...r]);
            if (newGrid[row][col].isFinish) return; // Prevent merging

            newGrid[startNodePos.row][startNodePos.col] = { ...newGrid[startNodePos.row][startNodePos.col], isStart: false };
            newGrid[row][col] = { ...newGrid[row][col], isStart: true, isWall: false };

            setGrid(newGrid);
            setStartNodePos({ row, col });
        } else if (draggingNode === 'finish') {
            const newGrid = grid.map(r => [...r]);
            if (newGrid[row][col].isStart) return; // Prevent merging

            newGrid[finishNodePos.row][finishNodePos.col] = { ...newGrid[finishNodePos.row][finishNodePos.col], isFinish: false };
            newGrid[row][col] = { ...newGrid[row][col], isFinish: true, isWall: false };

            setGrid(newGrid);
            setFinishNodePos({ row, col });
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
        }
    };

    const handleMouseUp = () => {
        if (isRunning) return;
        setMouseIsPressed(false);
        setDraggingNode(null);
    };

    const clearPath = () => {
        if (isRunning) return;
        
        const newGrid = grid.map(r => [...r]);
        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                newGrid[r][c].isVisited = false;
                newGrid[r][c].previousNode = null;
                newGrid[r][c].distance = Infinity;
                newGrid[r][c].isPath = false;
                
                const nodeElement = document.getElementById(`node-${r}-${c}`);
                if (nodeElement) {
                    if (newGrid[r][c].isStart) nodeElement.className = 'node node-start';
                    else if (newGrid[r][c].isFinish) nodeElement.className = 'node node-finish';
                    else if (newGrid[r][c].isWall) nodeElement.className = 'node node-wall';
                    else nodeElement.className = 'node';
                }
            }
        }
        setGrid(newGrid);
    };

    const visualizeBFS = () => {
        if (isRunning) return;
        
        // Remove old UI path elements cleanly before animating anew
        clearPath(); 
        
        // Allow state to catch up for clearPath visually
        setTimeout(() => {
            setIsRunning(true);
            const startNode = grid[startNodePos.row][startNodePos.col];
            const finishNode = grid[finishNodePos.row][finishNodePos.col];
            
            // bfs applies properties to grid object references seamlessly
            const visitedNodesInOrder = bfs(grid, startNode, finishNode);
            const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
            
            // Save to history
            saveToHistory('Pathfinding: BFS', 'pathfinding', 'bfs', { startNodePos, finishNodePos });

            animateBFS(visitedNodesInOrder, nodesInShortestPathOrder);
        }, 10);
    };

    const animateBFS = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isFinish) {
                    const el = document.getElementById(`node-${node.row}-${node.col}`);
                    if (el) el.className = 'node node-visited';
                }
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isStart && !node.isFinish) {
                    const el = document.getElementById(`node-${node.row}-${node.col}`);
                    if (el) el.className = 'node node-shortest-path';
                }
            }, 50 * i);
        }
        setTimeout(() => {
            setIsRunning(false);
        }, 50 * nodesInShortestPathOrder.length);
    };

    const resetGridFull = () => {
        if (isRunning) return;
        setGrid(getInitialGrid(10, 10, 10, 40));
        setStartNodePos({row: 10, col: 10});
        setFinishNodePos({row: 10, col: 40});
        
        for (let row = 0; row < NUM_ROWS; row++) {
            for (let col = 0; col < NUM_COLS; col++) {
                const node = document.getElementById(`node-${row}-${col}`);
                if (node) {
                    if (row === 10 && col === 10) node.className = 'node node-start';
                    else if (row === 10 && col === 40) node.className = 'node node-finish';
                    else node.className = 'node';
                }
            }
        }
    };

    return (
        <div className="main-content">
            <header className="page-header">
                <h1>Pathfinding Visualizer</h1>
                <p>Click and drag on the grid to add walls, then witness Breadth-First Search finding the shortest path.</p>
            </header>
            
            <div className="pathfinding-controls">
                <div className="legend">
                    <div className="legend-item"><div className="node node-start legend-node"></div> Start</div>
                    <div className="legend-item"><div className="node node-finish legend-node"></div> Finish</div>
                    <div className="legend-item"><div className="node node-wall legend-node"></div> Wall</div>
                    <div className="legend-item"><div className="node node-visited legend-node"></div> Visited</div>
                    <div className="legend-item"><div className="node node-shortest-path legend-node"></div> Path</div>
                </div>

                <div className="action-buttons">
                    <button className="btn success" onClick={visualizeBFS} disabled={isRunning}>
                        <Play size={18} /> Visualize BFS
                    </button>
                    <button className="btn info" onClick={clearPath} disabled={isRunning}>
                        <Eraser size={18} /> Clear Path
                    </button>
                    <button className="btn danger" onClick={resetGridFull} disabled={isRunning}>
                        <RotateCcw size={18} /> Reset All
                    </button>
                </div>
            </div>

            <div className="grid-container" onMouseLeave={handleMouseUp}>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx} className="grid-row">
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isFinish, isStart, isWall } = node;
                                    const extraClassName = isFinish
                                        ? 'node-finish'
                                        : isStart
                                        ? 'node-start'
                                        : isWall
                                        ? 'node-wall'
                                        : '';
                                    return (
                                        <div
                                            key={nodeIdx}
                                            id={`node-${row}-${col}`}
                                            className={`node ${extraClassName}`}
                                            onMouseDown={() => handleMouseDown(row, col)}
                                            onMouseEnter={() => handleMouseEnter(row, col)}
                                            onMouseUp={() => handleMouseUp()}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                <div className="grid-instructions">
                     <MousePointer2 size={16} /> Tip: Click and drag over the cells to draw walls rapidly. You can also drag the Start and Target icons to any position!
                </div>
            </div>
        </div>
    );
};

const getNewGridWithWallToggled = (grid, row, col) => {
    if (grid[row][col].isStart || grid[row][col].isFinish) return grid;
    const newGrid = grid.map(r => [...r]);
    const node = newGrid[row][col];
    newGrid[row][col] = {
        ...node,
        isWall: !node.isWall,
    };
    return newGrid;
};

export default PathfindingVisualizer;
