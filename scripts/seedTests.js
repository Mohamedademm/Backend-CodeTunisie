const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Test = require('../models/Test');
const Question = require('../models/Question');

// Load env vars
dotenv.config({ path: '../.env' });

// Fallback mongo URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codetunisiepro';

// Questions data for 10 tests (10 questions each)
const allQuestionsData = {
                questions: getQuestions("signalisation", 10, "facile")
            },
            {
                title: "قواعد الجولان والأولوية",
                description: "هل تتقن قواعد الأولوية في المفترقات؟ اكتشف ذلك الآن.",
                category: "priorites",
                difficulty: "moyen",
                duration: 20,
                passThreshold: 75,
                isPremium: false,
                questions: [...getQuestions("priorites", 5), ...getQuestions("regles", 5)]
            },
            {
                title: "الميكانيك والسلامة",
                description: "أسئلة حول صيانة السيارة والإسعافات الأولية.",
                category: "mecanique",
                difficulty: "moyen",
                duration: 15,
                passThreshold: 70,
                isPremium: true,
                questions: [...getQuestions("mecanique", 5), ...getQuestions("securite", 5)]
            },
            // Mock Exams
            {
                title: "امتحان تجريبي شامل (Examen Blanc)",
                description: "محاكاة للامتحان الرسمي. 30 سؤال متنوع في توقيت حقيقي.",
                category: "general",
                difficulty: "moyen",
                duration: 30, // 30 minutes
                passThreshold: 80, // 24/30 to pass
                isPremium: true,
                attempts: 0,
                // Mix of all categories
                questions: [
                    ...getQuestions("signalisation", 10),
                    ...getQuestions("regles", 8),
                    ...getQuestions("priorites", 7),
                    ...getQuestions("securite", 5)
                ]
            },
            {
                title: "تحدي السرعة (Speed Run)",
                description: "10 أسئلة سريعة لاختبار سرعة بديهتك.",
                category: "general",
                difficulty: "difficile",
                duration: 5, // 5 minutes
                passThreshold: 90,
                isPremium: false,
                questions: getQuestions(null, 10, "difficile")
            }
        ];

        // Ensure tests have enough questions before inserting
        const validTests = tests.filter(t => t.questions.length >= 5); // Minimum 5 questions

        await Test.insertMany(validTests);
        console.log(`Successfully seeded ${validTests.length} tests!`);

        process.exit();
    } catch (error) {
        console.error('Error seeding tests:', error);
        process.exit(1);
    }
};

seedTests();
