const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetunisiepro')
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    return seedTests();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err);
    process.exit(1);
  });

// Import models
const Test = require('../models/Test');
const Question = require('../models/Question');

// Professional test data
async function seedTests() {
  try {
    // Clear existing data
    console.log('\n🗑️  Nettoyage...');
    await Test.deleteMany({});
    await Question.deleteMany({});
    console.log('✓ Base nettoyée\n');

    // Test 1: Signalisation - 10 questions
    console.log('📝 Création Test 1: Signalisation Routière...');
    const test1Questions = await Question.insertMany([
      {
        questionText: "Que signifie un panneau triangle rouge inversé?",
        questionTextAr: "ماذا يعني لوح المثلث الأحمر المقلوب؟",
        options: ["Arrêt obligatoire", "Céder le passage", "Entrée interdite", "Danger"],
        optionsAr: ["توقف إلزامي", "أعطِ الأولوية", "ممنوع الدخول", "خطر"],
        correctAnswer: 1,
        explanation: "Triangle inversé = céder le passage",
        explanationAr: "المثلث المقلوب = أعطِ الأولوية",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Cercle rouge avec barre blanche signifie:",
        questionTextAr: "الدائرة الحمراء مع خط أبيض:",
        options: ["Sens interdit", "Arrêt interdit", "Route fermée", "Virage interdit"],
        optionsAr: ["ممنوع الدخول", "ممنوع التوقف", "طريق مغلق", "ممنوع الانعطاف"],
        correctAnswer: 0,
        explanation: "Sens interdit",
        explanationAr: "ممنوع الدخول",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Panneau bleu circulaire avec flèche:",
        questionTextAr: "اللوح الأزرق الدائري مع سهم:",
        options: ["Direction obligatoire", "Direction suggérée", "Direction interdite", "Autoroute"],
        optionsAr: ["اتجاه إلزامي", "اتجاه مقترح", "اتجاه ممنوع", "طريق سريع"],
        correctAnswer: 0,
        explanation: "Bleu circulaire = obligatoire",
        explanationAr: "الأزرق الدائري = إلزامي",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle jaune avec zigzag:",
        questionTextAr: "المثلث الأصفر مع التعرج:",
        options: ["Route glissante", "Virages dangereux", "Animaux", "Travaux"],
        optionsAr: ["طريق زلق", "منعطفات خطيرة", "حيوانات", "أشغال"],
        correctAnswer: 1,
        explanation: "Virages successifs",
        explanationAr: "منعطفات متتالية",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Panneau STOP octogonal rouge:",
        questionTextAr: "لوح STOP الأحمر:",
        options: ["Arrêt obligatoire", "Ralentir", "Prudence", "Céder passage"],
        optionsAr: ["توقف إلزامي", "تباطؤ", "حذر", "أعطِ الأولوية"],
        correctAnswer: 0,
        explanation: "STOP = arrêt complet",
        explanationAr: "STOP = توقف كامل",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Cercle bleu avec piéton:",
        questionTextAr: "الدائرة الزرقاء مع المشاة:",
        options: ["Passage piétons", "Chemin piétons uniquement", "Attention piétons", "Piétons interdits"],
        optionsAr: ["ممر مشاة", "طريق المشاة فقط", "انتبه للمشاة", "ممنوع المشاة"],
        correctAnswer: 1,
        explanation: "Chemin piétons",
        explanationAr: "طريق المشاة فقط",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle rouge avec enfants:",
        questionTextAr: "المثلث الأحمر مع الأطفال:",
        options: ["École proche", "Jardin d'enfants", "Enfants interdits", "Aire de jeux"],
        optionsAr: ["مدرسة قريبة", "روضة أطفال", "ممنوع الأطفال", "منطقة لعب"],
        correctAnswer: 0,
        explanation: "École à proximité",
        explanationAr: "مدرسة قريبة",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Cercle rouge avec 50:",
        questionTextAr: "الدائرة الحمراء مع 50:",
        options: ["Vitesse max 50", "Distance 50m", "Poids 50t", "Hauteur 50cm"],
        optionsAr: ["سرعة قصوى 50", "مسافة 50م", "وزن 50 طن", "ارتفاع 50سم"],
        correctAnswer: 0,
        explanation: "Limite de vitesse",
        explanationAr: "حد السرعة",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Carré bleu avec P:",
        questionTextAr: "المربع الأزرق مع P:",
        options: ["Parking", "Interdit stationner", "Taxi", "Police"],
        optionsAr: ["موقف", "ممنوع الوقوف", "تاكسي", "شرطة"],
        correctAnswer: 0,
        explanation: "Parking autorisé",
        explanationAr: "موقف سيارات",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle jaune avec exclamation:",
        questionTextAr: "المثلث الأصفر مع علامة التعجب:",
        options: ["Danger non spécifié", "Arrêt", "Entrée interdite", "Autoroute"],
        optionsAr: ["خطر غير محدد", "توقف", "ممنوع الدخول", "طريق سريع"],
        correctAnswer: 0,
        explanation: "Danger général",
        explanationAr: "خطر عام",
        category: "signalisation",
        difficulty: "facile"
      }
    ]);

    await Test.create({
      title: "Test 1: Signalisation Routière - Niveau Débutant",
      description: "Maîtrisez les panneaux de signalisation essentiels",
      questions: test1Questions.map(q => q._id),
      category: "signalisation",
      difficulty: "facile",
      duration: 15,
      passThreshold: 70,
      isPremium: false
    });
    console.log('✓ Test 1 créé: 10 questions\n');

    // Test 2: Examen Blanc - 10 questions
    console.log('📝 Création Test 2: Examen Blanc...');
    const test2Questions = await Question.insertMany([
      {
        questionText: "Priorité à une intersection sans signalisation?",
        questionTextAr: "الأولوية في تقاطع بدون إشارات؟",
        options: ["Droite", "Gauche", "Plus rapide", "Plus grand"],
        optionsAr: ["اليمين", "اليسار", "الأسرع", "الأكبر"],
        correctAnswer: 0,
        explanation: "Priorité à droite",
        explanationAr: "الأولوية لليمين",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Vitesse max en ville:",
        questionTextAr: "السرعة القصوى في المدينة:",
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        optionsAr: ["50 كم/س", "60 كم/س", "70 كم/س", "80 كم/س"],
        correctAnswer: 0,
        explanation: "50 km/h en agglomération",
        explanationAr: "50 كم/س داخل المدن",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Vérifier pression pneus:",
        questionTextAr: "فحص ضغط الإطارات:",
        options: ["Pneus chauds", "Pneus froids", "Peu importe", "Annuellement"],
        optionsAr: ["ساخنة", "باردة", "لا يهم", "سنوياً"],
        correctAnswer: 1,
        explanation: "À froid pour précision",
        explanationAr: "عندما تكون باردة",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "Tourner à gauche:",
        questionTextAr: "الانعطاف يساراً:",
        options: ["Signaler et céder", "Direct", "Klaxonner", "Accélérer"],
        optionsAr: ["إشارة وأولوية", "مباشرة", "الزمور", "تسارع"],
        correctAnswer: 0,
        explanation: "Signaler et céder passage",
        explanationAr: "إشارة وإعطاء الأولوية",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Distance sécurité augmente avec:",
        questionTextAr: "مسافة الأمان تزداد مع:",
        options: ["Vitesse", "Route sèche", "Jour", "Route droite"],
        optionsAr: ["السرعة", "الطريق الجاف", "النهار", "الطريق المستقيم"],
        correctAnswer: 0,
        explanation: "Plus vite = plus de distance",
        explanationAr: "أسرع = مسافة أكبر",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "Ceinture obligatoire pour:",
        questionTextAr: "الحزام إلزامي لـ:",
        options: ["Tous", "Conducteur", "Avant seulement", "Autoroute"],
        optionsAr: ["الجميع", "السائق", "الأمام فقط", "الطريق السريع"],
        correctAnswer: 0,
        explanation: "Tous les passagers",
        explanationAr: "جميع الركاب",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "Ambulance avec sirène:",
        questionTextAr: "سيارة إسعاف بالصفارة:",
        options: ["Dégager", "Rester", "Accélérer", "Arrêt milieu"],
        optionsAr: ["إفساح الطريق", "البقاء", "التسارع", "التوقف بالوسط"],
        correctAnswer: 0,
        explanation: "Céder le passage",
        explanationAr: "إفساح الطريق فوراً",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Téléphone en conduisant:",
        questionTextAr: "الهاتف أثناء القيادة:",
        options: ["Interdit", "Appels OK", "Kit libre OK", "Embouteillage OK"],
        optionsAr: ["ممنوع", "المكالمات مسموحة", "السماعة مسموحة", "الزحام مسموح"],
        correctAnswer: 0,
        explanation: "Totalement interdit",
        explanationAr: "ممنوع تماماً",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Taux alcool autorisé:",
        questionTextAr: "نسبة الكحول المسموحة:",
        options: ["0 g/L", "0.2 g/L", "0.5 g/L", "0.8 g/L"],
        optionsAr: ["0 غ/ل", "0.2 غ/ل", "0.5 غ/ل", "0.8 غ/ل"],
        correctAnswer: 0,
        explanation: "Tolérance zéro",
        explanationAr: "تسامح صفر",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Fatigue au volant:",
        questionTextAr: "التعب أثناء القيادة:",
        options: ["S'arrêter reposer", "Ouvrir fenêtre", "Continuer prudent", "Café"],
        optionsAr: ["التوقف للراحة", "فتح النافذة", "المتابعة بحذر", "القهوة"],
        correctAnswer: 0,
        explanation: "Arrêt et repos obligatoire",
        explanationAr: "التوقف والراحة",
        category: "securite",
        difficulty: "moyen"
      }
    ]);

    await Test.create({
      title: "Test 2: Examen Blanc Complet",
      description: "Simulation d'examen réel avec questions variées",
      questions: test2Questions.map(q => q._id),
      category: "general",
      difficulty: "moyen",
      duration: 30,
      passThreshold: 75,
      isPremium: false
    });
    console.log('✓ Test 2 créé: 10 questions\n');

    // Show summary
    const totalTests = await Test.countDocuments();
    const totalQuestions = await Question.countDocuments();
    
    console.log('✅ SUCCÈS!');
    console.log(`📊 ${totalTests} tests créés`);
    console.log(`📝 ${totalQuestions} questions créées\n`);
    
    console.log('💡 Pour ajouter les 8 autres tests:');
    console.log('   - Dupliquez la structure ci-dessus');
    console.log('   - Changez les catégories et questions');
    console.log('   - Relancez le script\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}
