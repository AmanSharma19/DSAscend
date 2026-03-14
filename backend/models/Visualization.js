const mongoose = require('mongoose');

const visualizationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'sorting', 'pathfinding', 'tree', 'dp', etc.
        required: true
    },
    algo: {
        type: String,
        required: true
    },
    data: {
        type: Object, // Stores initial array, tree structure, or custom code
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Visualization', visualizationSchema);
