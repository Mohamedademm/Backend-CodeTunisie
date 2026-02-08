// @route   POST /api/admin/upload-question-image
// @desc    Upload image for a question
// @access  Admin
router.post('/upload-question-image', questionImageUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucune image fournie'
            });
        }

        // Construct the URL for the uploaded image
        const imageUrl = `/uploads/questions/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploadée avec succès',
            data: {
                url: imageUrl,
                filename: req.file.filename,
                size: req.file.size,
                uploadedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload de l\'image',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/delete-question-image/:filename
// @desc    Delete a question image
// @access  Admin
router.delete('/delete-question-image/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/questions', filename);

        // Check if file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Image supprimée avec succès'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image non trouvée'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'image',
            error: error.message
        });
    }
});

module.exports = router;
