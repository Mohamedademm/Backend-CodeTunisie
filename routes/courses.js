const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, difficulty, isPremium } = req.query;

        // Build filter
        const filter = { isPublished: true };
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (isPremium !== undefined) filter.isPremium = isPremium === 'true';

        const courses = await Course.find(filter).sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: courses.length,
            courses,
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des cours',
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé',
            });
        }

        // Increment view count
        course.viewCount += 1;
        await course.save();

        res.json({
            success: true,
            course,
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du cours',
        });
    }
});

// @route   POST /api/courses
// @desc    Create a course
// @access  Private/Admin
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Cours créé avec succès',
            course,
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du cours',
            error: error.message,
        });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé',
            });
        }

        res.json({
            success: true,
            message: 'Cours mis à jour avec succès',
            course,
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du cours',
        });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé',
            });
        }

        res.json({
            success: true,
            message: 'Cours supprimé avec succès',
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du cours',
        });
    }
});

// @route   POST /api/courses/:id/complete
// @desc    Mark course as completed
// @access  Private
router.post('/:id/complete', requireAuth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Cours non trouvé',
            });
        }

        // Add to user's completed courses if not already there
        if (!req.user.coursesCompleted.includes(course._id)) {
            req.user.coursesCompleted.push(course._id);
            await req.user.save();

            // Increment completion count
            course.completionCount += 1;
            await course.save();
        }

        res.json({
            success: true,
            message: 'Cours marqué comme terminé',
        });
    } catch (error) {
        console.error('Complete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la complétion du cours',
        });
    }
});

module.exports = router;
