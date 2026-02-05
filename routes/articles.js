const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all articles (list with basic info)
router.get('/', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../data');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        const articles = files.map(file => {
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const article = JSON.parse(content);
            
            return {
                article_number: article.article_number,
                title: article.title,
                description: article.description,
                page_title: article.page_title,
                definition_count: article.definition_count || 0,
                difficulty_level: article.learning_metadata?.difficulty_level || 'intermediate',
                estimated_study_time_minutes: article.learning_metadata?.estimated_study_time_minutes || 5,
            };
        });
        
        // Sort by article number
        articles.sort((a, b) => a.article_number - b.article_number);
        
        res.json({
            success: true,
            data: articles,
            count: articles.length
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المقالات',
            error: error.message
        });
    }
});

// Get single article by number
router.get('/:articleNumber', async (req, res) => {
    try {
        const { articleNumber } = req.params;
        const dataDir = path.join(__dirname, '../data');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        // Find the file that matches the article number
        const targetFile = files.find(file => {
            const match = file.match(/article_(\d+)_/);
            return match && parseInt(match[1]) === parseInt(articleNumber);
        });
        
        if (!targetFile) {
            return res.status(404).json({
                success: false,
                message: 'المقال غير موجود'
            });
        }
        
        const filePath = path.join(dataDir, targetFile);
        const content = fs.readFileSync(filePath, 'utf8');
        const article = JSON.parse(content);
        
        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب المقال',
            error: error.message
        });
    }
});

// Get multiple articles for context (used by AI)
router.post('/context', async (req, res) => {
    try {
        const { articleNumbers } = req.body; // Array of article numbers
        
        if (!articleNumbers || !Array.isArray(articleNumbers)) {
            return res.status(400).json({
                success: false,
                message: 'يجب تقديم قائمة بأرقام المقالات'
            });
        }
        
        const dataDir = path.join(__dirname, '../data');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        const articles = [];
        
        for (const articleNumber of articleNumbers) {
            const targetFile = files.find(file => {
                const match = file.match(/article_(\d+)_/);
                return match && parseInt(match[1]) === parseInt(articleNumber);
            });
            
            if (targetFile) {
                const filePath = path.join(dataDir, targetFile);
                const content = fs.readFileSync(filePath, 'utf8');
                const article = JSON.parse(content);
                articles.push(article);
            }
        }
        
        res.json({
            success: true,
            data: articles,
            count: articles.length
        });
    } catch (error) {
        console.error('Error fetching articles context:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في جلب سياق المقالات',
            error: error.message
        });
    }
});

module.exports = router;
