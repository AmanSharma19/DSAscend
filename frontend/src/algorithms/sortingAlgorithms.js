// Returns an array of state snapshots
// Each snapshot has the form: { array: number[], comparing: number[], sorted: number[], swapping: number[], message: string }

export const bubbleSortOptions = {
    name: 'Bubble Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
};

export const getBubbleSortSteps = (initialArray) => {
    let array = [...initialArray];
    const steps = [];
    const sorted = [];

    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Starting Bubble Sort with array: [${array.join(", ")}]` });

    for (let i = 0; i < array.length - 1; i++) {
        let swapped = false;
        for (let j = 0; j < array.length - i - 1; j++) {
            steps.push({ array: [...array], comparing: [j, j + 1], sorted: [...sorted], swapping: [], message: `Comparing elements ${array[j]} and ${array[j + 1]} at indices ${j} and ${j+1}` });

            if (array[j] > array[j + 1]) {
                steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [j, j + 1], message: `${array[j]} is greater than ${array[j+1]}, so we swap them.` });
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                swapped = true;
                steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [j, j + 1], message: `Successfully swapped ${array[j]} and ${array[j+1]}.` });
            } else {
                 steps.push({ array: [...array], comparing: [j, j + 1], sorted: [...sorted], swapping: [], message: `${array[j]} is not greater than ${array[j+1]}, so no swap is needed.` });
            }
        }
        sorted.unshift(array.length - i - 1); 
        steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Pass complete. Element ${array[array.length - i - 1]} is now in its correct sorted position.` });
        
        if (!swapped) {
            while (sorted.length < array.length) {
                sorted.push(array.length - sorted.length - 1);
            }
            steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `No swaps occurred during this pass, meaning the array is fully sorted.` });
            break;
        }
    }
    if (!sorted.includes(0)) sorted.unshift(0);
    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Bubble Sort complete! Final Array: [${array.join(", ")}]` });
    return steps;
};


export const selectionSortOptions = {
    name: 'Selection Sort',
    timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items.',
};

export const getSelectionSortSteps = (initialArray) => {
    let array = [...initialArray];
    const steps = [];
    const sorted = [];

    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Starting Selection Sort with array: [${array.join(", ")}]` });

    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        steps.push({ array: [...array], comparing: [i], sorted: [...sorted], swapping: [], message: `Pass ${i+1}: Assuming minimum element is ${array[i]} at index ${i}.` });

        for (let j = i + 1; j < array.length; j++) {
            steps.push({ array: [...array], comparing: [minIdx, j], sorted: [...sorted], swapping: [], message: `Comparing current minimum ${array[minIdx]} with element ${array[j]} at index ${j}.` });
            if (array[j] < array[minIdx]) {
                minIdx = j;
                steps.push({ array: [...array], comparing: [minIdx], sorted: [...sorted], swapping: [], message: `Found new minimum element: ${array[minIdx]} at index ${minIdx}.` });
            }
        }
        if (minIdx !== i) {
            steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [i, minIdx], message: `Pass finish. Minimum element in remaining array is ${array[minIdx]}. Swapping with ${array[i]}` });
            let temp = array[i];
            array[i] = array[minIdx];
            array[minIdx] = temp;
            steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [i, minIdx], message: `Successfully swapped. Array state: [${array.join(", ")}]` });
        } else {
             steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Minimum element is already at position ${i}, no swap needed.` });
        }
        sorted.unshift(i);
        steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Element ${array[i]} is now securely in its correct sorted position.` });
    }
    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Selection Sort complete! Final Array: [${array.join(", ")}]` });
    return steps;
};

export const mergeSortOptions = {
    name: 'Merge Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    description: 'An efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output.',
};

export const getMergeSortSteps = (initialArray) => {
    let array = [...initialArray];
    const steps = [];

    steps.push({ array: [...array], comparing: [], sorted: [], swapping: [], message: `Starting Merge Sort with array: [${array.join(", ")}]` });

    const doMerge = (mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) => {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;

        steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [], message: `Merging sub-arrays: [${auxiliaryArray.slice(startIdx, middleIdx + 1).join(', ')}] and [${auxiliaryArray.slice(middleIdx + 1, endIdx + 1).join(', ')}] into main array from indices ${startIdx} to ${endIdx}.` });

        while (i <= middleIdx && j <= endIdx) {
            steps.push({ array: [...mainArray], comparing: [k], sorted: [], swapping: [], message: `Comparing elements ${auxiliaryArray[i]} (left) and ${auxiliaryArray[j]} (right)` });

            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                mainArray[k] = auxiliaryArray[i];
                steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [k], message: `${auxiliaryArray[i]} <= ${auxiliaryArray[j]}, so writing ${auxiliaryArray[i]} to index ${k}` }); 
                i++;
            } else {
                mainArray[k] = auxiliaryArray[j];
                steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [k], message: `${auxiliaryArray[j]} < ${auxiliaryArray[i]}, so writing ${auxiliaryArray[j]} to index ${k}` }); 
                j++;
            }
            k++;
        }

        while (i <= middleIdx) {
            mainArray[k] = auxiliaryArray[i];
            steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [k], message: `Left sub-array has remaining elements. Writing ${auxiliaryArray[i]} to index ${k}` });
            i++;
            k++;
        }

        while (j <= endIdx) {
            mainArray[k] = auxiliaryArray[j];
            steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [k], message: `Right sub-array has remaining elements. Writing ${auxiliaryArray[j]} to index ${k}` });
            j++;
            k++;
        }
        
        steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [], message: `Merged section from index ${startIdx} to ${endIdx}: [${mainArray.slice(startIdx, endIdx + 1).join(', ')}]` });
    };

    const mergeSortHelper = (mainArray, startIdx, endIdx, auxiliaryArray) => {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        
        steps.push({ array: [...mainArray], comparing: [], sorted: [], swapping: [], message: `Dividing array from index ${startIdx} to ${endIdx} into two halves: Left (${startIdx} to ${middleIdx}) and Right (${middleIdx + 1} to ${endIdx}).` });
        
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
    };

    const auxiliaryArray = [...initialArray];
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray);

    const sorted = Array.from({length: array.length}, (_, i) => i);
    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Merge Sort complete! Final Array: [${array.join(", ")}]` });
    return steps;
};

export const insertionSortOptions = {
    name: 'Insertion Sort',
    timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
};

export const getInsertionSortSteps = (initialArray) => {
    let array = [...initialArray];
    const steps = [];
    const sorted = [0];

    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Starting Insertion Sort with array: [${array.join(", ")}]` });

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        steps.push({ array: [...array], comparing: [i], sorted: [...sorted], swapping: [], message: `Pass ${i}: Holding element ${key} as key.` });

        while (j >= 0 && array[j] > key) {
            steps.push({ array: [...array], comparing: [j, j + 1], sorted: [...sorted], swapping: [], message: `${array[j]} is greater than the key ${key}. Moving it to the right.` });
            steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [j, j + 1], message: `Moved ${array[j]} to position ${j + 1}.` });
            array[j + 1] = array[j];
            j = j - 1;
        }
        
        array[j + 1] = key;
        sorted.push(i);
        steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [j + 1], message: `Inserted key ${key} at position ${j + 1}.` });
    }
    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Insertion Sort complete! Final Array: [${array.join(", ")}]` });
    return steps;
};

export const quickSortOptions = {
    name: 'Quick Sort',
    timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    description: 'An efficient, in-place, divide-and-conquer sorting algorithm that selects a pivot element and partitions the array around it.',
};

export const getQuickSortSteps = (initialArray) => {
    let array = [...initialArray];
    const steps = [];
    const sorted = [];

    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Starting Quick Sort with array: [${array.join(", ")}]` });

    const partition = (arr, low, high) => {
        let pivot = arr[high];
        steps.push({ array: [...arr], comparing: [high], sorted: [...sorted], swapping: [], message: `Selected ${pivot} as the pivot.` });

        let i = low - 1;

        for (let j = low; j < high; j++) {
            steps.push({ array: [...arr], comparing: [j, high], sorted: [...sorted], swapping: [], message: `Comparing element ${arr[j]} with pivot ${pivot}.` });
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    steps.push({ array: [...arr], comparing: [], sorted: [...sorted], swapping: [i, j], message: `${arr[j]} < ${pivot}. Swapped ${arr[i]} and ${arr[j]}.` });
                }
            }
        }

        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        sorted.push(i + 1);
        steps.push({ array: [...arr], comparing: [], sorted: [...sorted], swapping: [i + 1, high], message: `Placed pivot ${pivot} in its correct sorted position at index ${i + 1}.` });

        return i + 1;
    };

    const quickSortHelper = (arr, low, high) => {
        if (low < high) {
            let pi = partition(arr, low, high);
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        } else if (low === high) {
            sorted.push(low);
            steps.push({ array: [...arr], comparing: [], sorted: [...sorted], swapping: [], message: `Element at index ${low} is trivially sorted in its subarray.` });
        }
    };

    quickSortHelper(array, 0, array.length - 1);
    
    // Ensure all indices are marked as sorted at the end
    for(let k=0; k<array.length; k++) {
        if(!sorted.includes(k)) sorted.push(k);
    }

    steps.push({ array: [...array], comparing: [], sorted: [...sorted], swapping: [], message: `Quick Sort complete! Final Array: [${array.join(", ")}]` });
    return steps;
};

export const SORTING_ALGORITHMS = {
    bubble: { ...bubbleSortOptions, getSteps: getBubbleSortSteps },
    selection: { ...selectionSortOptions, getSteps: getSelectionSortSteps },
    insertion: { ...insertionSortOptions, getSteps: getInsertionSortSteps },
    quick: { ...quickSortOptions, getSteps: getQuickSortSteps },
    merge: { ...mergeSortOptions, getSteps: getMergeSortSteps },
};
