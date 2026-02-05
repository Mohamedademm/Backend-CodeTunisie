const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI Assistant Chat endpoint
router.post('/chat', async (req, res) => {
    try {
        const { question, currentArticleNumber, includeNearbyArticles = true } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'يجب تقديم سؤال'
            });
        }

        // Build context from articles
        let context = '';
        const dataDir = path.join(__dirname, '../data');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

        // Get articles for context
        const articlesToLoad = [];

        if (currentArticleNumber) {
            // Add current article
            articlesToLoad.push(parseInt(currentArticleNumber));

            // Add nearby articles if requested
            if (includeNearbyArticles) {
                const current = parseInt(currentArticleNumber);
                if (current > 1) articlesToLoad.push(current - 1);
                if (current > 2) articlesToLoad.push(current - 2);
                articlesToLoad.push(current + 1);
                articlesToLoad.push(current + 2);
            }
        }

        // Load article contents for context
        const loadedArticles = [];
        for (const articleNum of articlesToLoad) {
            const targetFile = files.find(file => {
                const match = file.match(/article_(\d+)_/);
                return match && parseInt(match[1]) === articleNum;
            });

            if (targetFile) {
                const filePath = path.join(dataDir, targetFile);
                const content = fs.readFileSync(filePath, 'utf8');
                const article = JSON.parse(content);
                loadedArticles.push(article);
            }
        }

        // Build context string with article details
        if (loadedArticles.length > 0) {
            context = `أنت مساعد قانوني متخصص في مجلة الطرقات التونسية (قانون المرور التونسي). 
أنت تجيب على أسئلة المستخدمين بناءً على الفصول والمقالات القانونية.

المستخدم يقرأ حالياً الفصل رقم ${currentArticleNumber}.

السياق القانوني المتاح لك:
${'='.repeat(50)}

`;

            for (const article of loadedArticles) {
                context += `📖 ${article.title} (الفصل ${article.article_number})
${'─'.repeat(40)}
${article.content?.full_text || ''}

`;

                // Add definitions if available
                if (article.definitions && article.definitions.length > 0) {
                    context += `\n📚 التعريفات في هذا الفصل:\n`;
                    for (const def of article.definitions) {
                        context += `• ${def.term}: ${def.definition}\n`;
                    }
                    context += '\n';
                }
            }

            context += `${'='.repeat(50)}

⚠️ تعليمات مهمة:
1. أجب باللغة العربية فقط
2. استند إلى الفصول والتعريفات المذكورة أعلاه
3. إذا كان السؤال خارج نطاق السياق المتاح، وضح ذلك بأدب
4. قدم أمثلة عملية عند الإمكان
5. اذكر رقم الفصل عند الإشارة إلى قانون معين

السؤال: ${question}

الإجابة:`;
        } else {
            // No specific article context - general question
            context = `أنت مساعد قانوني متخصص في مجلة الطرقات التونسية (قانون المرور التونسي).

⚠️ تعليمات:
1. أجب باللغة العربية
2. قدم معلومات عامة عن قانون المرور التونسي
3. إذا كنت غير متأكد، اطلب من المستخدم تحديد الفصل المعني

السؤال: ${question}

الإجابة:`;
        }

        // Call the AI API (using environment variable for flexibility)
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:6009/LocalForge/chat';
        const aiResponse = await axios.post(aiServiceUrl, {
            prompt: context
        }, {
            timeout: 60000, // 60 second timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            data: {
                answer: aiResponse.data.result,
                context: {
                    currentArticle: currentArticleNumber,
                    articlesUsed: loadedArticles.map(a => ({
                        number: a.article_number,
                        title: a.title
                    }))
                }
            }
        });

    } catch (error) {
        console.error('Error in AI assistant:', error);

        // Check if it's a connection error to the AI API
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({
                success: false,
                message: 'خدمة المساعد الذكي غير متاحة حالياً. يرجى المحاولة لاحقاً.',
                error: 'AI service unavailable'
            });
        }

        res.status(500).json({
            success: false,
            message: 'خطأ في معالجة السؤال',
            error: error.message
        });
    }
});

module.exports = router;
