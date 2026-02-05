const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// @route   GET /api/tests
// @desc    Get all tests
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, difficulty, isPremium } = req.query;

        // Build filter
        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (isPremium !== undefined) filter.isPremium = isPremium === 'true';

        const tests = await Test.find(filter)
            .populate('questions', 'question category difficulty')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: tests.length,
            tests,
        });
    } catch (error) {
        console.error('Get tests error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des tests',
        });
    }
});

// @route   GET /api/tests/:id
// @desc    Get single test with questions
// @access  Private
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
            .populate({
                path: 'questions',
                select: '-correctAnswer -explanation', // Don't send answers initially
            });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test non trouvé',
            });
        }

        res.json({
            success: true,
            test,
        });
    } catch (error) {
        console.error('Get test error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du test',
        });
    }
});

// @route   POST /api/tests
// @desc    Create a test
// @access  Private/Admin
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const test = await Test.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Test créé avec succès',
            test,
        });
    } catch (error) {
        console.error('Create test error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du test',
            error: error.message,
        });
    }
});

// @route   POST /api/tests/:id/submit
// @desc    Submit test answers
// @access  Private
router.post('/:id/submit', requireAuth, async (req, res) => {
    try {
        const { answers, timeTaken } = req.body; // answers: [{ questionId, selectedAnswer }]

        const test = await Test.findById(req.params.id).populate('questions');

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test non trouvé',
            });
        }

        // Calculate score
        let correctCount = 0;
        const processedAnswers = [];

        for (const answer of answers) {
            const question = test.questions.find(q => q._id.toString() === answer.questionId);

            if (question) {
                const isCorrect = question.correctAnswer === answer.selectedAnswer;
                if (isCorrect) correctCount++;

                // Update question statistics
                question.timesAsked += 1;
                if (isCorrect) question.timesCorrect += 1;
                await question.save();

                processedAnswers.push({
                    question: question._id,
                    selectedAnswer: answer.selectedAnswer,
                    isCorrect,
                });
            }
        }

        const score = (correctCount / test.questions.length) * 100;
        const passed = score >= test.passThreshold;

        // Create test attempt
        const testAttempt = await TestAttempt.create({
            user: req.user._id,
            test: test._id,
            answers: processedAnswers,
            score,
            passed,
            timeTaken,
        });

        // Update test statistics
        test.attemptCount += 1;
        if (passed) test.passCount += 1;
        await test.save();

        // Add to user's test attempts
        req.user.testsAttempted.push(testAttempt._id);
        await req.user.save();

        // Populate the test attempt with full question details
        const populatedAttempt = await TestAttempt.findById(testAttempt._id)
            .populate({
                path: 'test',
                select: 'title description passThreshold',
            })
            .populate({
                path: 'answers.question',
                select: 'question options correctAnswer explanation image',
            });

        res.json({
            success: true,
            message: passed ? 'Félicitations! Vous avez réussi le test!' : 'Test échoué. Continuez à vous entraîner!',
            testAttempt: populatedAttempt,
            score,
            passed,
            correctCount,
            totalQuestions: test.questions.length,
        });
    } catch (error) {
        console.error('Submit test error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la soumission du test',
            error: error.message,
        });
    }
});

// @route   GET /api/tests/:id/attempts
// @desc    Get user's attempts for a test
// @access  Private
router.get('/:id/attempts', requireAuth, async (req, res) => {
    try {
        const attempts = await TestAttempt.find({
            user: req.user._id,
            test: req.params.id,
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            count: attempts.length,
            attempts,
        });
    } catch (error) {
        console.error('Get attempts error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des tentatives',
        });
    }
});

// @route   PUT /api/tests/:id
// @desc    Update a test
// @access  Private/Admin
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test non trouvé',
            });
        }

        res.json({
            success: true,
            message: 'Test mis à jour avec succès',
            test,
        });
    } catch (error) {
        console.error('Update test error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du test',
        });
    }
});

// @route   DELETE /api/tests/:id
// @desc    Delete a test
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test non trouvé',
            });
        }

        res.json({
            success: true,
            message: 'Test supprimé avec succès',
        });
    } catch (error) {
        console.error('Delete test error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du test',
        });
    }
});

module.exports = router;
