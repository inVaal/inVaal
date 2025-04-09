// Null data handler
function handleNullData(data) {
    // Check if data is null or undefined
    if (data === null || data === undefined) {
        console.warn('Null or undefined data detected');
        return false;
    }
    
    // If data is an object, check for empty properties
    if (typeof data === 'object') {
        return Object.values(data).some(value => value !== null);
    }
    
    return true;
}

// Example usage
function displayContent(content) {
    if (handleNullData(content)) {
        // Render content
    } else {
        // Display placeholder or hide element
    }
}