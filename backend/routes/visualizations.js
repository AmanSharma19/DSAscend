const express = require('express');
const router = express.Router();
const Visualization = require('../models/Visualization');
const auth = require('../middleware/auth');

// Save a new visualization session
router.post('/save', auth, async (req, res) => {
    try {
        const { title, type, algo, data, language } = req.body;
        
        const newViz = new Visualization({
            userId: req.user.id,
            title,
            type,
            algo,
            data,
            language
        });

        await newViz.save();
        res.status(201).json(newViz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user visualization history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Visualization.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a history item
router.delete('/:id', auth, async (req, res) => {
    try {
        const viz = await Visualization.findOne({ _id: req.params.id, userId: req.user.id });
        if (!viz) return res.status(404).json({ message: 'Visualization not found' });
        
        await viz.deleteOne();
        res.json({ message: 'History item removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
