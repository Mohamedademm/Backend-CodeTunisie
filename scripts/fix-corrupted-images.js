require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

/**
 * Script de Migration - Nettoyage des Images Corrompues
 * 
 * Ce script parcourt toutes les questions et corrige les images corrompues
 * en les remplaçant par des objets vides mais valides.
 */

async function fixCorruptedImages() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Récupérer toutes les questions
        const questions = await Question.find({});
        console.log(`📊 ${questions.length} questions trouvées`);

        let fixedCount = 0;
        let alreadyValidCount = 0;

        for (const question of questions) {
            let needsUpdate = false;
            let originalImage = JSON.stringify(question.image);

            // Cas 1: image est une chaîne (corrompu)
            if (typeof question.image === 'string') {
                console.log(`🔧 Question ${question._id}: Image est une chaîne "${question.image}"`);
                question.image = { url: '', filename: '', size: 0 };
                needsUpdate = true;
            }
            // Cas 2: image est un objet mais avec des champs manquants
            else if (question.image && typeof question.image === 'object') {
                if (!question.image.url && !question.image.filename) {
                    // Objet vide ou invalide
                    question.image = { url: '', filename: '', size: 0 };
                    needsUpdate = true;
                    console.log(`🔧 Question ${question._id}: Image objet vide/invalide`);
                } else {
                    alreadyValidCount++;
                }
            }

            if (needsUpdate) {
                await question.save();
                fixedCount++;
                console.log(`   ✅ Corrigé: ${originalImage} → ${JSON.stringify(question.image)}`);
            }
        }

        console.log('\n📈 Résumé:');
        console.log(`   ✅ ${fixedCount} questions corrigées`);
        console.log(`   ✓ ${alreadyValidCount} questions déjà valides`);
        console.log(`   📊 Total: ${questions.length} questions`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Déconnecté de MongoDB');
    }
}

// Exécuter le script
fixCorruptedImages();
