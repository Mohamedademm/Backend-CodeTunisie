const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// @route   GET /api/questions
// @desc    Get all questions
// @access  Private/Admin
router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { category, difficulty, isActive } = req.query;

        // Build filter
        const filter = {};
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const questions = await Question.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des questions',
        });
    }
});

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Private/Admin
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée',
            });
        }

        res.json({
            success: true,
            question,
        });
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la question',
        });
    }
});

// @route   POST /api/questions
// @desc    Create a question
// @access  Private/Admin
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const question = await Question.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Question créée avec succès',
            question,
        });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la question',
            error: error.message,
        });
    }
});

// @route   PUT /api/questions/:id
// @desc    Update a question
// @access  Private/Admin
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée',
            });
        }

        res.json({
            success: true,
            message: 'Question mise à jour avec succès',
            question,
        });
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la question',
        });
    }
});

// @route   DELETE /api/questions/:id
// @desc    Delete a question
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question non trouvée',
            });
        }

        res.json({
            success: true,
            message: 'Question supprimée avec succès',
        });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la question',
        });
    }
});

// @route   GET /api/questions/random/:count
// @desc    Get random questions for practice
// @access  Private
router.get('/random/:count', requireAuth, async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const { category, difficulty } = req.query;

        const filter = { isActive: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;

        const questions = await Question.aggregate([
            { $match: filter },
            { $sample: { size: count } },
            { $project: { correctAnswer: 0, explanation: 0 } }, // Don't send answers
        ]);

        res.json({
            success: true,
            count: questions.length,
            questions,
        });
    } catch (error) {
        console.error('Get random questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des questions',
        });
    }
});

module.exports = router;
