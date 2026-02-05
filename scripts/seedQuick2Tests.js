require('dotenv').config();
const mongoose = require('mongoose');
const Test = require('../models/Test');
const Question = require('../models/Question');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetunisiepro')
  .then(() => {
    console.log('✅ MongoDB connecté');
    return seedTests();
  })
  .catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
  });

async function seedTests() {
  try {
    console.log('\n🗑️  Nettoyage...');
    await Test.deleteMany({});
    await Question.deleteMany({});
    console.log('✓ Base nettoyée\n');

    const testsData = [
      // Test 1
      {
        title: "Test 1: Signalisation Routière - Niveau Débutant",
        description: "Maîtrisez les panneaux de signalisation essentiels",
        category: "signalisation",
        difficulty: "facile",
        duration: 15,
        passThreshold: 70,
        questions: [
          {
            question: "Que signifie un panneau triangle rouge inversé?",
            options: ["Arrêt obligatoire", "Céder le passage", "Entrée interdite", "Danger"],
            correctAnswer: 1,
            explanation: "Le triangle rouge inversé signifie céder le passage",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Un cercle rouge avec une barre blanche signifie:",
            options: ["Sens interdit", "Arrêt interdit", "Route fermée", "Virage interdit"],
            correctAnswer: 0,
            explanation: "Cercle rouge avec barre = sens interdit",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Panneau bleu circulaire avec flèche blanche:",
            options: ["Direction obligatoire", "Direction suggérée", "Direction interdite", "Autoroute"],
            correctAnswer: 0,
            explanation: "Bleu circulaire = obligation",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Triangle jaune avec zigzag avertit de:",
            options: ["Route glissante", "Virages dangereux", "Animaux sauvages", "Travaux"],
            correctAnswer: 1,
            explanation: "Zigzag = virages successifs",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Panneau STOP octogonal rouge signifie:",
            options: ["Arrêt obligatoire", "Ralentir", "Prudence", "Céder passage"],
            correctAnswer: 0,
            explanation: "STOP = arrêt complet obligatoire",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Cercle bleu avec piéton indique:",
            options: ["Passage piétons", "Chemin piétons uniquement", "Attention piétons", "Piétons interdits"],
            correctAnswer: 1,
            explanation: "Chemin réservé aux piétons",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Triangle rouge avec enfants avertit de:",
            options: ["École proche", "Jardin d'enfants", "Enfants interdits", "Aire de jeux"],
            correctAnswer: 0,
            explanation: "Présence d'une école",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Cercle rouge avec 50 indique:",
            options: ["Vitesse max 50 km/h", "Distance 50m", "Poids 50 tonnes", "Hauteur 50cm"],
            correctAnswer: 0,
            explanation: "Limite de vitesse maximale",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Carré bleu avec P indique:",
            options: ["Parking autorisé", "Stationnement interdit", "Station de taxi", "Poste de police"],
            correctAnswer: 0,
            explanation: "Zone de stationnement",
            category: "signalisation",
            difficulty: "facile"
          },
          {
            question: "Triangle jaune avec point d'exclamation:",
            options: ["Danger non spécifié", "Arrêt obligatoire", "Entrée interdite", "Autoroute"],
            correctAnswer: 0,
            explanation: "Avertissement de danger général",
            category: "signalisation",
            difficulty: "facile"
          }
        ]
      },
      // Test 2
      {
        title: "Test 2: Examen Blanc Complet",
        description: "Simulation d'examen réel avec questions variées",
        category: "general",
        difficulty: "moyen",
        duration: 30,
        passThreshold: 75,
        questions: [
          {
            question: "À une intersection sans signalisation, qui a la priorité?",
            options: ["Véhicule de droite", "Véhicule de gauche", "Plus rapide", "Plus grand"],
            correctAnswer: 0,
            explanation: "Priorité à droite en Tunisie",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Vitesse maximale en agglomération:",
            options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
            correctAnswer: 0,
            explanation: "50 km/h dans les villes",
            category: "regles",
            difficulty: "moyen"
          },
          {
            question: "Vérifier la pression des pneus:",
            options: ["Pneus chauds", "Pneus froids", "Peu importe", "Une fois par an"],
            correctAnswer: 1,
            explanation: "À froid pour précision",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Pour tourner à gauche, vous devez:",
            options: ["Signaler et céder", "Tourner direct", "Klaxonner", "Accélérer"],
            correctAnswer: 0,
            explanation: "Signaler et céder le passage",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Distance de sécurité augmente avec:",
            options: ["Vitesse élevée", "Route sèche", "Jour", "Route droite"],
            correctAnswer: 0,
            explanation: "Plus vite = plus de distance",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Ceinture de sécurité obligatoire pour:",
            options: ["Tous les passagers", "Conducteur seul", "Avant seulement", "Autoroute seulement"],
            correctAnswer: 0,
            explanation: "Obligatoire pour tous",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "En voyant une ambulance avec sirène:",
            options: ["Dégager immédiatement", "Rester", "Accélérer", "Arrêt au milieu"],
            correctAnswer: 0,
            explanation: "Céder passage aux urgences",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Utilisation du téléphone en conduisant:",
            options: ["Totalement interdit", "Appels OK", "Kit libre OK", "Embouteillage OK"],
            correctAnswer: 0,
            explanation: "Interdit complètement",
            category: "regles",
            difficulty: "moyen"
          },
          {
            question: "Taux d'alcool autorisé:",
            options: ["0 g/L", "0.2 g/L", "0.5 g/L", "0.8 g/L"],
            correctAnswer: 0,
            explanation: "Tolérance zéro en Tunisie",
            category: "regles",
            difficulty: "moyen"
          },
          {
            question: "En cas de fatigue au volant:",
            options: ["S'arrêter reposer", "Ouvrir fenêtre", "Continuer prudent", "Boire café"],
            correctAnswer: 0,
            explanation: "Repos obligatoire",
            category: "securite",
            difficulty: "moyen"
          }
        ]
      }
    ];

    // Create tests
    for (let i = 0; i < testsData.length; i++) {
      const testData = testsData[i];
      console.log(`📝 Création Test ${i + 1}: ${testData.title}`);
      
      const questions = await Question.insertMany(testData.questions);
      console.log(`   ✓ ${questions.length} questions créées`);
      
      await Test.create({
        title: testData.title,
        description: testData.description,
        category: testData.category,
        difficulty: testData.difficulty,
        duration: testData.duration,
        passThreshold: testData.passThreshold,
        questions: questions.map(q => q._id)
      });
      console.log(`   ✓ Test créé\n`);
    }

    const total = await Test.countDocuments();
    const totalQ = await Question.countDocuments();
    
    console.log('✅ SUCCÈS!');
    console.log(`📊 ${total} tests créés`);
    console.log(`📝 ${totalQ} questions créées\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}
