const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetunisiepro')
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    return seedAllTests();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err);
    process.exit(1);
  });

// Import models
const Test = require('../models/Test');
const Question = require('../models/Question');

// ALL 10 TESTS DATA
const allTestsData = [
  // TEST 1: Signalisation Routière
  {
    config: {
      title: "Test 1: Signalisation Routière - Niveau Débutant",
      description: "Maîtrisez les panneaux de signalisation essentiels : interdiction, danger et obligation",
      category: "signalisation",
      difficulty: "facile",
      duration: 15,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Que signifie un panneau triangle rouge inversé?",
        questionTextAr: "ماذا يعني لوح المثلث الأحمر المقلوب؟",
        options: ["Arrêt obligatoire", "Céder le passage", "Entrée interdite", "Danger"],
        optionsAr: ["توقف إلزامي", "أعطِ الأولوية", "ممنوع الدخول", "خطر"],
        correctAnswer: 1,
        explanation: "Le triangle rouge inversé signifie céder le passage",
        explanationAr: "المثلث الأحمر المقلوب يعني أعطِ الأولوية",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Un cercle rouge avec une barre blanche signifie:",
        questionTextAr: "الدائرة الحمراء مع خط أبيض تعني:",
        options: ["Sens interdit", "Arrêt interdit", "Route fermée", "Virage interdit"],
        optionsAr: ["ممنوع الدخول", "ممنوع التوقف", "طريق مغلق", "ممنوع الانعطاف"],
        correctAnswer: 0,
        explanation: "Cercle rouge avec barre = sens interdit",
        explanationAr: "الدائرة الحمراء مع خط = ممنوع الدخول",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Panneau bleu circulaire avec flèche blanche:",
        questionTextAr: "اللوح الأزرق الدائري مع سهم أبيض:",
        options: ["Direction obligatoire", "Direction suggérée", "Direction interdite", "Autoroute"],
        optionsAr: ["اتجاه إلزامي", "اتجاه مقترح", "اتجاه ممنوع", "طريق سريع"],
        correctAnswer: 0,
        explanation: "Bleu circulaire = obligation",
        explanationAr: "الأزرق الدائري = إلزامي",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle jaune avec zigzag avertit de:",
        questionTextAr: "المثلث الأصفر مع التعرج يحذر من:",
        options: ["Route glissante", "Virages dangereux", "Animaux sauvages", "Travaux"],
        optionsAr: ["طريق زلق", "منعطفات خطيرة", "حيوانات برية", "أشغال"],
        correctAnswer: 1,
        explanation: "Zigzag = virages successifs",
        explanationAr: "التعرج = منعطفات متتالية",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Panneau STOP octogonal rouge signifie:",
        questionTextAr: "لوح STOP الأحمر الثماني:",
        options: ["Arrêt obligatoire", "Ralentir", "Prudence", "Céder passage"],
        optionsAr: ["توقف إلزامي", "تباطؤ", "حذر", "أعطِ الأولوية"],
        correctAnswer: 0,
        explanation: "STOP = arrêt complet obligatoire",
        explanationAr: "STOP = توقف كامل إلزامي",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Cercle bleu avec piéton indique:",
        questionTextAr: "الدائرة الزرقاء مع المشاة تشير إلى:",
        options: ["Passage piétons", "Chemin piétons uniquement", "Attention piétons", "Piétons interdits"],
        optionsAr: ["ممر مشاة", "طريق المشاة فقط", "انتبه للمشاة", "ممنوع المشاة"],
        correctAnswer: 1,
        explanation: "Chemin réservé aux piétons",
        explanationAr: "طريق مخصص للمشاة فقط",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle rouge avec enfants avertit de:",
        questionTextAr: "المثلث الأحمر مع الأطفال يحذر من:",
        options: ["École proche", "Jardin d'enfants", "Enfants interdits", "Aire de jeux"],
        optionsAr: ["مدرسة قريبة", "روضة أطفال", "ممنوع الأطفال", "منطقة لعب"],
        correctAnswer: 0,
        explanation: "Présence d'une école",
        explanationAr: "وجود مدرسة قريبة",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Cercle rouge avec 50 indique:",
        questionTextAr: "الدائرة الحمراء مع 50 تشير إلى:",
        options: ["Vitesse max 50 km/h", "Distance 50m", "Poids 50 tonnes", "Hauteur 50cm"],
        optionsAr: ["سرعة قصوى 50 كم/س", "مسافة 50م", "وزن 50 طن", "ارتفاع 50سم"],
        correctAnswer: 0,
        explanation: "Limite de vitesse maximale",
        explanationAr: "حد السرعة القصوى",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Carré bleu avec 'P' indique:",
        questionTextAr: "المربع الأزرق مع 'P' يشير إلى:",
        options: ["Parking autorisé", "Stationnement interdit", "Station de taxi", "Poste de police"],
        optionsAr: ["موقف سيارات مسموح", "ممنوع الوقوف", "موقف تاكسي", "مركز شرطة"],
        correctAnswer: 0,
        explanation: "Zone de stationnement",
        explanationAr: "منطقة موقف سيارات",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Triangle jaune avec point d'exclamation:",
        questionTextAr: "المثلث الأصفر مع علامة التعجب:",
        options: ["Danger non spécifié", "Arrêt obligatoire", "Entrée interdite", "Autoroute"],
        optionsAr: ["خطر غير محدد", "توقف إلزامي", "ممنوع الدخول", "طريق سريع"],
        correctAnswer: 0,
        explanation: "Avertissement de danger général",
        explanationAr: "تحذير من خطر عام",
        category: "signalisation",
        difficulty: "facile"
      }
    ]
  },

  // TEST 2: Examen Blanc
  {
    config: {
      title: "Test 2: Examen Blanc Complet",
      description: "Simulation d'examen réel avec questions variées sur toutes les catégories",
      category: "general",
      difficulty: "moyen",
      duration: 30,
      passThreshold: 75,
      isPremium: false
    },
    questions: [
      {
        questionText: "À une intersection sans signalisation, qui a la priorité?",
        questionTextAr: "في تقاطع بدون إشارات، من له الأولوية؟",
        options: ["Véhicule de droite", "Véhicule de gauche", "Plus rapide", "Plus grand"],
        optionsAr: ["المركبة من اليمين", "المركبة من اليسار", "الأسرع", "الأكبر"],
        correctAnswer: 0,
        explanation: "Priorité à droite en Tunisie",
        explanationAr: "الأولوية لليمين في تونس",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Vitesse maximale en agglomération:",
        questionTextAr: "السرعة القصوى داخل المدن:",
        options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        optionsAr: ["50 كم/س", "60 كم/س", "70 كم/س", "80 كم/س"],
        correctAnswer: 0,
        explanation: "50 km/h dans les villes",
        explanationAr: "50 كم/س داخل المدن",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Vérifier la pression des pneus:",
        questionTextAr: "فحص ضغط الإطارات:",
        options: ["Pneus chauds", "Pneus froids", "Peu importe", "Une fois par an"],
        optionsAr: ["إطارات ساخنة", "إطارات باردة", "لا يهم", "مرة سنوياً"],
        correctAnswer: 1,
        explanation: "À froid pour précision",
        explanationAr: "عندما تكون باردة للدقة",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "Pour tourner à gauche, vous devez:",
        questionTextAr: "للانعطاف يساراً، يجب:",
        options: ["Signaler et céder", "Tourner direct", "Klaxonner", "Accélérer"],
        optionsAr: ["الإشارة والأولوية", "الانعطاف مباشرة", "الزمور", "التسارع"],
        correctAnswer: 0,
        explanation: "Signaler et céder le passage",
        explanationAr: "الإشارة وإعطاء الأولوية",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Distance de sécurité augmente avec:",
        questionTextAr: "مسافة الأمان تزداد مع:",
        options: ["Vitesse élevée", "Route sèche", "Jour", "Route droite"],
        optionsAr: ["السرعة العالية", "الطريق الجاف", "النهار", "الطريق المستقيم"],
        correctAnswer: 0,
        explanation: "Plus vite = plus de distance",
        explanationAr: "أسرع = مسافة أكبر",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "Ceinture de sécurité obligatoire pour:",
        questionTextAr: "حزام الأمان إلزامي لـ:",
        options: ["Tous les passagers", "Conducteur seul", "Avant seulement", "Autoroute seulement"],
        optionsAr: ["جميع الركاب", "السائق فقط", "الأمام فقط", "الطريق السريع فقط"],
        correctAnswer: 0,
        explanation: "Obligatoire pour tous",
        explanationAr: "إلزامي للجميع",
        category: "securite",
        difficulty: "moyen"
      },
      {
        questionText: "En voyant une ambulance avec sirène:",
        questionTextAr: "عند رؤية سيارة إسعاف بالصفارة:",
        options: ["Dégager immédiatement", "Rester", "Accélérer", "Arrêt au milieu"],
        optionsAr: ["إفساح الطريق فوراً", "البقاء", "التسارع", "التوقف بالوسط"],
        correctAnswer: 0,
        explanation: "Céder passage aux urgences",
        explanationAr: "إفساح الطريق للطوارئ",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Utilisation du téléphone en conduisant:",
        questionTextAr: "استعمال الهاتف أثناء القيادة:",
        options: ["Totalement interdit", "Appels OK", "Kit libre OK", "Embouteillage OK"],
        optionsAr: ["ممنوع تماماً", "المكالمات مسموحة", "السماعة OK", "الزحام OK"],
        correctAnswer: 0,
        explanation: "Interdit complètement",
        explanationAr: "ممنوع تماماً",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Taux d'alcool autorisé:",
        questionTextAr: "نسبة الكحول المسموحة:",
        options: ["0 g/L", "0.2 g/L", "0.5 g/L", "0.8 g/L"],
        optionsAr: ["0 غ/ل", "0.2 غ/ل", "0.5 غ/ل", "0.8 غ/ل"],
        correctAnswer: 0,
        explanation: "Tolérance zéro en Tunisie",
        explanationAr: "تسامح صفر في تونس",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "En cas de fatigue au volant:",
        questionTextAr: "عند التعب أثناء القيادة:",
        options: ["S'arrêter reposer", "Ouvrir fenêtre", "Continuer prudent", "Boire café"],
        optionsAr: ["التوقف للراحة", "فتح النافذة", "المتابعة بحذر", "شرب القهوة"],
        correctAnswer: 0,
        explanation: "Repos obligatoire",
        explanationAr: "الراحة إلزامية",
        category: "securite",
        difficulty: "moyen"
      }
    ]
  },

  // TEST 3: Règles de Priorité
  {
    config: {
      title: "Test 3: Règles de Priorité",
      description: "Apprenez les règles de priorité aux intersections et carrefours",
      category: "priorites",
      difficulty: "moyen",
      duration: 20,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Dans un rond-point, priorité à:",
        questionTextAr: "في الدوار، الأولوية لـ:",
        options: ["Véhicules dans le rond-point", "Véhicules entrant", "Plus rapide", "Pas de priorité"],
        optionsAr: ["المركبات داخل الدوار", "المركبات الداخلة", "الأسرع", "لا أولوية"],
        correctAnswer: 0,
        explanation: "Priorité aux véhicules déjà dans le rond-point",
        explanationAr: "الأولوية للمركبات داخل الدوار",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Au panneau 'Céder le passage':",
        questionTextAr: "عند لوح 'أعطِ الأولوية':",
        options: ["Ralentir et céder", "Arrêt obligatoire", "Continuer", "Klaxonner"],
        optionsAr: ["التباطؤ والأولوية", "توقف إلزامي", "المتابعة", "الزمور"],
        correctAnswer: 0,
        explanation: "Ralentir et préparer l'arrêt",
        explanationAr: "التباطؤ والاستعداد للتوقف",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Ambulance avec sirène approche:",
        questionTextAr: "سيارة إسعاف بالصفارة تقترب:",
        options: ["Dégager immédiatement", "Rester en place", "Arrêt au milieu", "Accélérer"],
        optionsAr: ["إفساح المجال فوراً", "البقاء", "التوقف بالوسط", "التسارع"],
        correctAnswer: 0,
        explanation: "Priorité absolue aux urgences",
        explanationAr: "أولوية مطلقة للطوارئ",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Feu de circulation en panne, priorité à:",
        questionTextAr: "إشارة المرور معطلة، الأولوية لـ:",
        options: ["Véhicule de droite", "Véhicule de gauche", "Premier arrivé", "Plus grand"],
        optionsAr: ["المركبة من اليمين", "المركبة من اليسار", "الأول وصولاً", "الأكبر"],
        correctAnswer: 0,
        explanation: "Règle de priorité à droite",
        explanationAr: "قاعدة الأولوية لليمين",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Au passage piétons sans feu:",
        questionTextAr: "عند معبر المشاة بدون إشارة:",
        options: ["Priorité aux piétons", "Priorité aux voitures", "Premier arrivé", "Pas de règle"],
        optionsAr: ["أولوية للمشاة", "أولوية للسيارات", "الأول وصولاً", "لا قاعدة"],
        correctAnswer: 0,
        explanation: "Piétons toujours prioritaires",
        explanationAr: "المشاة دائماً لهم الأولوية",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Intersection en T, priorité à:",
        questionTextAr: "تقاطع على شكل T، الأولوية لـ:",
        options: ["Route principale", "Route secondaire", "Véhicule de droite", "Pas de différence"],
        optionsAr: ["الطريق الرئيسي", "الطريق الثانوي", "المركبة من اليمين", "لا فرق"],
        correctAnswer: 0,
        explanation: "Priorité à la route principale",
        explanationAr: "الأولوية للطريق الرئيسي",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Passage à niveau, priorité absolue à:",
        questionTextAr: "معبر السكة الحديدية، الأولوية المطلقة لـ:",
        options: ["Train", "Voitures", "Règle droite", "Pas de priorité"],
        optionsAr: ["القطار", "السيارات", "قاعدة اليمين", "لا أولوية"],
        correctAnswer: 0,
        explanation: "Train a toujours priorité absolue",
        explanationAr: "القطار له الأولوية المطلقة",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Route principale croise route secondaire:",
        questionTextAr: "طريق رئيسي يتقاطع مع طريق ثانوي:",
        options: ["Principale prioritaire", "Secondaire prioritaire", "Règle droite", "Pas de différence"],
        optionsAr: ["الرئيسي له الأولوية", "الثانوي له الأولوية", "قاعدة اليمين", "لا فرق"],
        correctAnswer: 0,
        explanation: "Route principale toujours prioritaire",
        explanationAr: "الطريق الرئيسي دائماً له الأولوية",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Sortie de parking:",
        questionTextAr: "الخروج من موقف السيارات:",
        options: ["Céder aux véhicules", "J'ai priorité", "Règle droite", "Pas de règle"],
        optionsAr: ["إعطاء الأولوية للمركبات", "لي الأولوية", "قاعدة اليمين", "لا قاعدة"],
        correctAnswer: 0,
        explanation: "Céder passage en sortant",
        explanationAr: "إعطاء الأولوية عند الخروج",
        category: "priorites",
        difficulty: "moyen"
      },
      {
        questionText: "Passage étroit, qui recule?",
        questionTextAr: "ممر ضيق، من يتراجع؟",
        options: ["Plus facile à reculer", "Véhicule plus petit", "Véhicule plus lent", "Personne"],
        optionsAr: ["الأسهل تراجعاً", "المركبة الأصغر", "المركبة الأبطأ", "لا أحد"],
        correctAnswer: 0,
        explanation: "Celui qui peut reculer facilement",
        explanationAr: "من كان التراجع أسهل له",
        category: "priorites",
        difficulty: "moyen"
      }
    ]
  },

  // TEST 4: Sécurité et Entretien
  {
    config: {
      title: "Test 4: Sécurité et Entretien",
      description: "Questions sur la sécurité routière et l'entretien du véhicule",
      category: "securite",
      difficulty: "facile",
      duration: 15,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Vérifier le niveau d'huile moteur:",
        questionTextAr: "فحص مستوى زيت المحرك:",
        options: ["Régulièrement", "Une fois par an", "Changement pneus", "Pas besoin"],
        optionsAr: ["بانتظام", "مرة سنوياً", "عند تغيير الإطارات", "لا حاجة"],
        correctAnswer: 0,
        explanation: "Vérification régulière essentielle",
        explanationAr: "الفحص المنتظم ضروري",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Profondeur minimale des sculptures de pneus:",
        questionTextAr: "العمق الأدنى لنقوش الإطارات:",
        options: ["1.6 mm", "3 mm", "5 mm", "Peu importe"],
        optionsAr: ["1.6 ملم", "3 ملم", "5 ملم", "لا يهم"],
        correctAnswer: 0,
        explanation: "Minimum légal 1.6 mm",
        explanationAr: "الحد الأدنى القانوني 1.6 ملم",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Triangle de signalisation utilisé pour:",
        questionTextAr: "مثلث التحذير يستعمل لـ:",
        options: ["Arrêt d'urgence", "Arrêt normal", "Parking", "Jamais"],
        optionsAr: ["التوقف الطارئ", "التوقف العادي", "الموقف", "أبداً"],
        correctAnswer: 0,
        explanation: "Obligatoire en cas de panne",
        explanationAr: "إلزامي عند التوقف الطارئ",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Rétroviseurs doivent être:",
        questionTextAr: "المرايا الجانبية يجب أن تكون:",
        options: ["Bien réglés", "Toujours pliés", "Décorés", "Pas important"],
        optionsAr: ["مضبوطة جيداً", "مطوية دائماً", "مزينة", "غير مهمة"],
        correctAnswer: 0,
        explanation: "Réglage correct obligatoire",
        explanationAr: "الضبط الصحيح إلزامي",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Contrôle technique obligatoire:",
        questionTextAr: "الفحص الفني إلزامي:",
        options: ["Chaque année", "Tous les 2 ans", "Tous les 5 ans", "Pas obligatoire"],
        optionsAr: ["كل سنة", "كل سنتين", "كل 5 سنوات", "غير إلزامي"],
        correctAnswer: 0,
        explanation: "Annuel en Tunisie",
        explanationAr: "سنوياً في تونس",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "En cas d'éclatement de pneu:",
        questionTextAr: "عند انفجار إطار:",
        options: ["Tenir volant et ralentir", "Freiner fort", "Accélérer", "Tourner vite"],
        optionsAr: ["إمساك المقود والتباطؤ", "الفرملة القوية", "التسارع", "الانعطاف السريع"],
        correctAnswer: 0,
        explanation: "Contrôle et ralentissement progressif",
        explanationAr: "السيطرة والتباطؤ التدريجي",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Extincteur dans la voiture:",
        questionTextAr: "طفاية الحريق في السيارة:",
        options: ["Obligatoire et vérifié", "Optionnel", "Décoratif", "Pas nécessaire"],
        optionsAr: ["إلزامية ومفحوصة", "اختيارية", "للزينة", "غير ضرورية"],
        correctAnswer: 0,
        explanation: "Obligatoire et en bon état",
        explanationAr: "إلزامية وبحالة جيدة",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Enfants de moins de 10 ans doivent:",
        questionTextAr: "الأطفال دون 10 سنوات يجب:",
        options: ["Siège arrière", "Siège avant", "N'importe où", "Par terre"],
        optionsAr: ["المقعد الخلفي", "المقعد الأمامي", "أي مكان", "على الأرض"],
        correctAnswer: 0,
        explanation: "Arrière obligatoire pour moins de 10 ans",
        explanationAr: "الخلف إلزامي لأقل من 10 سنوات",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Vérifier les feux du véhicule:",
        questionTextAr: "فحص أضواء السيارة:",
        options: ["Régulièrement", "Une fois par an", "En cas de panne", "Pas besoin"],
        optionsAr: ["بانتظام", "مرة سنوياً", "عند العطل", "لا حاجة"],
        correctAnswer: 0,
        explanation: "Vérification régulière essentielle",
        explanationAr: "الفحص المنتظم ضروري",
        category: "securite",
        difficulty: "facile"
      },
      {
        questionText: "Avant d'acheter une voiture d'occasion:",
        questionTextAr: "قبل شراء سيارة مستعملة:",
        options: ["Inspection complète", "Achat immédiat", "Pas d'inspection", "Confiance vendeur"],
        optionsAr: ["فحص شامل", "شراء فوري", "بدون فحص", "الثقة بالبائع"],
        correctAnswer: 0,
        explanation: "Inspection obligatoire",
        explanationAr: "الفحص الشامل إلزامي",
        category: "securite",
        difficulty: "facile"
      }
    ]
  },

  // TEST 5: Infractions et Sanctions
  {
    config: {
      title: "Test 5: Infractions et Sanctions",
      description: "Connaître les infractions routières et leurs sanctions",
      category: "regles",
      difficulty: "moyen",
      duration: 20,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Conduire sans permis:",
        questionTextAr: "القيادة بدون رخصة:",
        options: ["Infraction grave", "Infraction légère", "Permis", "Amende seulement"],
        optionsAr: ["مخالفة خطيرة", "مخالفة بسيطة", "مسموح", "غرامة فقط"],
        correctAnswer: 0,
        explanation: "Infraction très grave",
        explanationAr: "مخالفة خطيرة جداً",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Excès de vitesse de 30 km/h:",
        questionTextAr: "تجاوز السرعة بـ 30 كم/س:",
        options: ["Amende et points", "Avertissement", "Rien", "Suspension permis"],
        optionsAr: ["غرامة ونقاط", "تحذير", "لا شيء", "سحب الرخصة"],
        correctAnswer: 0,
        explanation: "Amende + retrait de points",
        explanationAr: "غرامة وسحب نقاط",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Stationnement interdit:",
        questionTextAr: "الوقوف في مكان ممنوع:",
        options: ["Amende financière", "Rien", "Avertissement", "Suspension"],
        optionsAr: ["غرامة مالية", "لا شيء", "تحذير", "سحب رخصة"],
        correctAnswer: 0,
        explanation: "Amende applicable",
        explanationAr: "غرامة مالية",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Conduite en état d'ivresse:",
        questionTextAr: "القيادة تحت تأثير الكحول:",
        options: ["Crime grave", "Infraction légère", "Permis", "Avertissement"],
        optionsAr: ["جريمة خطيرة", "مخالفة بسيطة", "مسموح", "تحذير"],
        correctAnswer: 0,
        explanation: "Crime très grave",
        explanationAr: "جريمة خطيرة جداً",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Non-respect du feu rouge:",
        questionTextAr: "عدم احترام الضوء الأحمر:",
        options: ["Amende et points", "Avertissement", "Rien", "Amende seule"],
        optionsAr: ["غرامة ونقاط", "تحذير", "لا شيء", "غرامة فقط"],
        correctAnswer: 0,
        explanation: "Infraction grave",
        explanationAr: "مخالفة خطيرة",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Ne pas porter la ceinture:",
        questionTextAr: "عدم ارتداء حزام الأمان:",
        options: ["Amende financière", "Avertissement", "Rien", "Suspension"],
        optionsAr: ["غرامة مالية", "تحذير", "لا شيء", "سحب رخصة"],
        correctAnswer: 0,
        explanation: "Amende obligatoire",
        explanationAr: "غرامة إلزامية",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Téléphone en main au volant:",
        questionTextAr: "الهاتف باليد أثناء القيادة:",
        options: ["Amende financière", "Permis", "Avertissement", "Rien"],
        optionsAr: ["غرامة مالية", "مسموح", "تحذير", "لا شيء"],
        correctAnswer: 0,
        explanation: "Infraction sanctionnée",
        explanationAr: "مخالفة معاقب عليها",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Vitesse excessive en zone résidentielle:",
        questionTextAr: "السرعة المفرطة في منطقة سكنية:",
        options: ["Infraction très grave", "Infraction normale", "Permis", "Avertissement"],
        optionsAr: ["مخالفة خطيرة جداً", "مخالفة عادية", "مسموح", "تحذير"],
        correctAnswer: 0,
        explanation: "Danger pour les résidents",
        explanationAr: "خطر على السكان",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Véhicule non assuré:",
        questionTextAr: "سيارة غير مؤمنة:",
        options: ["Infraction légale", "Permis", "Optionnel", "Avertissement"],
        optionsAr: ["مخالفة قانونية", "مسموح", "اختياري", "تحذير"],
        correctAnswer: 0,
        explanation: "Assurance obligatoire",
        explanationAr: "التأمين إلزامي",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Refus de s'arrêter à un contrôle:",
        questionTextAr: "رفض التوقف للشرطة:",
        options: ["Crime grave", "Infraction légère", "Permis", "Avertissement"],
        optionsAr: ["جريمة خطيرة", "مخالفة بسيطة", "مسموح", "تحذير"],
        correctAnswer: 0,
        explanation: "Crime très grave",
        explanationAr: "جريمة خطيرة جداً",
        category: "regles",
        difficulty: "moyen"
      }
    ]
  },

  // TEST 6: Conduite en Conditions Spéciales (Premium)
  {
    config: {
      title: "Test 6: Conduite en Conditions Spéciales",
      description: "Conduite de nuit, sous la pluie, dans le brouillard et sur routes glissantes",
      category: "conduite",
      difficulty: "difficile",
      duration: 25,
      passThreshold: 75,
      isPremium: true
    },
    questions: [
      {
        questionText: "Par temps de pluie, vous devez:",
        questionTextAr: "في الطقس الممطر، يجب:",
        options: ["Réduire vitesse et distance", "Vitesse normale", "Accélérer", "Feux de route"],
        optionsAr: ["تخفيف السرعة وزيادة المسافة", "السرعة العادية", "التسارع", "النور العالي"],
        correctAnswer: 0,
        explanation: "Réduction vitesse essentielle",
        explanationAr: "تخفيف السرعة ضروري",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "En cas de brouillard dense:",
        questionTextAr: "في الضباب الكثيف:",
        options: ["Feux de brouillard", "Feux de route", "Pas de feux", "Éteindre feux"],
        optionsAr: ["أضواء الضباب", "النور العالي", "بدون أضواء", "إطفاء الأنوار"],
        correctAnswer: 0,
        explanation: "Feux de brouillard spécifiques",
        explanationAr: "أضواء الضباب المخصصة",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Conduite nocturne nécessite:",
        questionTextAr: "القيادة الليلية تتطلب:",
        options: ["Plus d'attention et vitesse modérée", "Vitesse élevée", "Moins d'attention", "Feux éteints"],
        optionsAr: ["انتباه أكبر وسرعة معتدلة", "سرعة عالية", "انتباه أقل", "أضواء مطفأة"],
        correctAnswer: 0,
        explanation: "Vigilance accrue la nuit",
        explanationAr: "يقظة أكبر ليلاً",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Sur route verglacée:",
        questionTextAr: "على طريق جليدي:",
        options: ["Très lentement et prudemment", "Vitesse normale", "Accélérer", "Freiner souvent"],
        optionsAr: ["ببطء شديد وبحذر", "سرعة عادية", "تسارع", "فرملة كثيرة"],
        correctAnswer: 0,
        explanation: "Prudence extrême requise",
        explanationAr: "حذر شديد مطلوب",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "En entrant dans un tunnel:",
        questionTextAr: "عند دخول نفق:",
        options: ["Allumer les feux", "Éteindre les feux", "Klaxonner", "Accélérer"],
        optionsAr: ["إشعال الأنوار", "إطفاء الأنوار", "الزمور", "التسارع"],
        correctAnswer: 0,
        explanation: "Feux obligatoires dans tunnels",
        explanationAr: "الأنوار إلزامية في الأنفاق",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "En cas de dérapage:",
        questionTextAr: "عند الانزلاق:",
        options: ["Ne pas freiner brusquement", "Freiner fort", "Tourner brusquement", "Accélérer"],
        optionsAr: ["عدم الفرملة القوية", "فرملة قوية", "انعطاف حاد", "تسارع"],
        correctAnswer: 0,
        explanation: "Éviter freinage brusque",
        explanationAr: "تجنب الفرملة الحادة",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Sous soleil intense:",
        questionTextAr: "تحت أشعة الشمس القوية:",
        options: ["Porter lunettes soleil", "Ne pas regarder route", "Fermer les yeux", "Accélérer"],
        optionsAr: ["ارتداء نظارة شمسية", "عدم النظر للطريق", "إغلاق العينين", "التسارع"],
        correctAnswer: 0,
        explanation: "Protection des yeux nécessaire",
        explanationAr: "حماية العينين ضرورية",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Par vent fort:",
        questionTextAr: "في الرياح القوية:",
        options: ["Tenir fermement le volant", "Lâcher le volant", "Accélérer", "Tourner brusquement"],
        optionsAr: ["إمساك المقود بقوة", "ترك المقود", "تسارع", "انعطاف حاد"],
        correctAnswer: 0,
        explanation: "Contrôle ferme du véhicule",
        explanationAr: "سيطرة قوية على المركبة",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Traversée d'une zone inondée:",
        questionTextAr: "عبور منطقة مغمورة:",
        options: ["Très lentement", "Vite", "Ne pas traverser", "Accélérer dans l'eau"],
        optionsAr: ["ببطء شديد", "بسرعة", "عدم العبور", "تسارع في الماء"],
        correctAnswer: 0,
        explanation: "Traversée lente si nécessaire",
        explanationAr: "عبور بطيء إذا ضروري",
        category: "conduite",
        difficulty: "difficile"
      },
      {
        questionText: "Panne électrique dans tunnel:",
        questionTextAr: "انقطاع الكهرباء في النفق:",
        options: ["Arrêt sécurisé et attendre", "Continuer vite", "Marche arrière", "Faire demi-tour"],
        optionsAr: ["توقف آمن وانتظار", "المتابعة بسرعة", "الرجوع للخلف", "الاستدارة"],
        correctAnswer: 0,
        explanation: "Arrêt et attente des secours",
        explanationAr: "التوقف وانتظار المساعدة",
        category: "conduite",
        difficulty: "difficile"
      }
    ]
  },

  // TEST 7: Feux de Signalisation
  {
    config: {
      title: "Test 7: Feux de Signalisation",
      description: "Comprendre les feux de circulation et comment réagir",
      category: "signalisation",
      difficulty: "facile",
      duration: 15,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Feu vert signifie:",
        questionTextAr: "الضوء الأخضر يعني:",
        options: ["Passage autorisé", "Arrêt", "Prudence", "Céder passage"],
        optionsAr: ["المرور مسموح", "توقف", "حذر", "أعطِ الأولوية"],
        correctAnswer: 0,
        explanation: "Autorisation de passer",
        explanationAr: "إذن المرور",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu rouge signifie:",
        questionTextAr: "الضوء الأحمر يعني:",
        options: ["Arrêt obligatoire", "Passage autorisé", "Ralentir", "Prudence"],
        optionsAr: ["توقف إلزامي", "المرور مسموح", "تباطؤ", "حذر"],
        correctAnswer: 0,
        explanation: "Arrêt complet obligatoire",
        explanationAr: "توقف كامل إلزامي",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu orange (jaune) signifie:",
        questionTextAr: "الضوء البرتقالي يعني:",
        options: ["Prudence, préparer arrêt", "Accélérer", "Arrêt immédiat", "Passage libre"],
        optionsAr: ["حذر، الاستعداد للتوقف", "تسارع", "توقف فوري", "مرور حر"],
        correctAnswer: 0,
        explanation: "Préparation à l'arrêt",
        explanationAr: "الاستعداد للتوقف",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Flèche verte de direction:",
        questionTextAr: "السهم الأخضر للاتجاه:",
        options: ["Tourner en sécurité", "Tourner interdit", "Prudence", "Arrêt"],
        optionsAr: ["الانعطاف بأمان", "ممنوع الانعطاف", "حذر", "توقف"],
        correctAnswer: 0,
        explanation: "Autorisation de tourner",
        explanationAr: "إذن الانعطاف",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu piéton vert signifie:",
        questionTextAr: "إشارة المشاة الخضراء:",
        options: ["Piétons peuvent traverser", "Traversée interdite", "Prudence", "Attendre"],
        optionsAr: ["المشاة يمكنهم العبور", "ممنوع العبور", "حذر", "انتظار"],
        correctAnswer: 0,
        explanation: "Autorisation de traverser",
        explanationAr: "إذن العبور",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu rouge clignotant signifie:",
        questionTextAr: "الضوء الأحمر الوامض:",
        options: ["Arrêt puis continuer prudemment", "Continuer vite", "Prudence seulement", "Rien"],
        optionsAr: ["توقف ثم المتابعة بحذر", "المتابعة بسرعة", "حذر فقط", "لا شيء"],
        correctAnswer: 0,
        explanation: "Arrêt complet puis continuation",
        explanationAr: "توقف كامل ثم المتابعة",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu jaune clignotant signifie:",
        questionTextAr: "الضوء الأصفر الوامض:",
        options: ["Prudence et ralentir", "Arrêt", "Accélérer", "Rien"],
        optionsAr: ["حذر وتباطؤ", "توقف", "تسارع", "لا شيء"],
        correctAnswer: 0,
        explanation: "Avertissement de prudence",
        explanationAr: "تحذير بالحذر",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu en panne:",
        questionTextAr: "إشارة معطلة:",
        options: ["Intersection non réglementée", "Continuer vite", "Arrêt obligatoire", "Faire demi-tour"],
        optionsAr: ["تقاطع غير منظم", "المتابعة بسرعة", "توقف إلزامي", "الاستدارة"],
        correctAnswer: 0,
        explanation: "Appliquer règles priorité",
        explanationAr: "تطبيق قواعد الأولوية",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu rouge clignotant passage à niveau:",
        questionTextAr: "الضوء الأحمر الوامض عند السكة:",
        options: ["Arrêt - train approche", "Passage libre", "Prudence seulement", "Accélérer"],
        optionsAr: ["توقف - قطار قادم", "المرور حر", "حذر فقط", "تسارع"],
        correctAnswer: 0,
        explanation: "Train approche - danger",
        explanationAr: "قطار قادم - خطر",
        category: "signalisation",
        difficulty: "facile"
      },
      {
        questionText: "Feu vert avec flèche rouge:",
        questionTextAr: "الضوء الأخضر مع سهم أحمر:",
        options: ["Passage droit seulement", "Tourner autorisé", "Arrêt", "Rien"],
        optionsAr: ["المرور مستقيماً فقط", "الانعطاف مسموح", "توقف", "لا شيء"],
        correctAnswer: 0,
        explanation: "Vert pour tout droit uniquement",
        explanationAr: "الأخضر للمستقيم فقط",
        category: "signalisation",
        difficulty: "facile"
      }
    ]
  },

  // TEST 8: Distances et Vitesses
  {
    config: {
      title: "Test 8: Distances et Vitesses",
      description: "Limites de vitesse et distances de sécurité requises",
      category: "regles",
      difficulty: "moyen",
      duration: 20,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Vitesse max sur autoroute:",
        questionTextAr: "السرعة القصوى على الطريق السريع:",
        options: ["110 km/h", "90 km/h", "120 km/h", "130 km/h"],
        optionsAr: ["110 كم/س", "90 كم/س", "120 كم/س", "130 كم/س"],
        correctAnswer: 0,
        explanation: "110 km/h en Tunisie",
        explanationAr: "110 كم/س في تونس",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Vitesse max hors agglomération:",
        questionTextAr: "السرعة القصوى خارج المدن:",
        options: ["90 km/h", "70 km/h", "100 km/h", "110 km/h"],
        optionsAr: ["90 كم/س", "70 كم/س", "100 كم/س", "110 كم/س"],
        correctAnswer: 0,
        explanation: "90 km/h routes nationales",
        explanationAr: "90 كم/س على الطرق الوطنية",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Distance de sécurité calculée selon:",
        questionTextAr: "مسافة الأمان تحسب حسب:",
        options: ["Vitesse", "Taille véhicule", "Un mètre", "Pas de calcul"],
        optionsAr: ["السرعة", "حجم المركبة", "متر واحد", "لا حساب"],
        correctAnswer: 0,
        explanation: "Proportionnelle à la vitesse",
        explanationAr: "متناسبة مع السرعة",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "À 90 km/h, distance de freinage environ:",
        questionTextAr: "على 90 كم/س، مسافة الفرملة حوالي:",
        options: ["65 mètres", "30 mètres", "15 mètres", "100 mètres"],
        optionsAr: ["65 متر", "30 متر", "15 متر", "100 متر"],
        correctAnswer: 0,
        explanation: "~65m sur route sèche",
        explanationAr: "~65م على طريق جاف",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Règle des 2 secondes signifie:",
        questionTextAr: "قاعدة الثانيتين تعني:",
        options: ["2s entre vous et véhicule avant", "Arrêt toutes les 2s", "Freiner 2s", "Rien"],
        optionsAr: ["ثانيتان بينك والمركبة الأمامية", "التوقف كل ثانيتين", "فرملة لثانيتين", "لا شيء"],
        correctAnswer: 0,
        explanation: "Distance temporelle sécurité",
        explanationAr: "مسافة زمنية آمنة",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Sous la pluie, distance de sécurité:",
        questionTextAr: "في المطر، مسافة الأمان:",
        options: ["Doubler", "Même distance", "Réduire", "Pas de différence"],
        optionsAr: ["مضاعفة", "نفس المسافة", "تقليل", "لا فرق"],
        correctAnswer: 0,
        explanation: "Distance doublée sous pluie",
        explanationAr: "مضاعفة المسافة تحت المطر",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Vitesse min sur autoroute:",
        questionTextAr: "السرعة الدنيا على الطريق السريع:",
        options: ["40 km/h", "30 km/h", "50 km/h", "Pas de minimum"],
        optionsAr: ["40 كم/س", "30 كم/س", "50 كم/س", "لا حد أدنى"],
        correctAnswer: 0,
        explanation: "Minimum généralement 40 km/h",
        explanationAr: "الحد الأدنى عادة 40 كم/س",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Dans les virages serrés:",
        questionTextAr: "في المنعطفات الحادة:",
        options: ["Ralentir avant", "Accélérer", "Même vitesse", "Freiner dedans"],
        optionsAr: ["التباطؤ قبلها", "تسارع", "نفس السرعة", "فرملة داخلها"],
        correctAnswer: 0,
        explanation: "Réduction vitesse avant virage",
        explanationAr: "تخفيف السرعة قبل المنعطف",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Près des écoles, vitesse max:",
        questionTextAr: "بالقرب من المدارس، السرعة القصوى:",
        options: ["30 km/h", "50 km/h", "40 km/h", "20 km/h"],
        optionsAr: ["30 كم/س", "50 كم/س", "40 كم/س", "20 كم/س"],
        correctAnswer: 0,
        explanation: "30 km/h zones scolaires",
        explanationAr: "30 كم/س قرب المدارس",
        category: "regles",
        difficulty: "moyen"
      },
      {
        questionText: "Distance d'arrêt totale comprend:",
        questionTextAr: "مسافة التوقف الكلية تشمل:",
        options: ["Réaction + freinage", "Freinage seul", "Réaction seule", "Rien"],
        optionsAr: ["رد الفعل + الفرملة", "الفرملة فقط", "رد الفعل فقط", "لا شيء"],
        correctAnswer: 0,
        explanation: "Temps réaction + distance freinage",
        explanationAr: "زمن رد الفعل + مسافة الفرملة",
        category: "regles",
        difficulty: "moyen"
      }
    ]
  },

  // TEST 9: Manœuvres et Virages
  {
    config: {
      title: "Test 9: Manœuvres et Virages",
      description: "Techniques de virage, marche arrière et manœuvres essentielles",
      category: "conduite",
      difficulty: "moyen",
      duration: 20,
      passThreshold: 70,
      isPremium: false
    },
    questions: [
      {
        questionText: "Pour tourner à droite:",
        questionTextAr: "للانعطاف يميناً:",
        options: ["Signaler et vérifier angle mort", "Tourner directement", "Pas de signal", "Accélérer"],
        optionsAr: ["الإشارة والتحقق من النقطة العمياء", "الانعطاف مباشرة", "بدون إشارة", "تسارع"],
        correctAnswer: 0,
        explanation: "Signal et vérification obligatoires",
        explanationAr: "الإشارة والتحقق إلزاميان",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Marche arrière doit se faire:",
        questionTextAr: "الرجوع للخلف يجب:",
        options: ["Lentement avec vérifications", "Rapidement", "Sans regarder", "Rétroviseurs seulement"],
        optionsAr: ["ببطء مع التحقق", "بسرعة", "بدون نظر", "المرايا فقط"],
        correctAnswer: 0,
        explanation: "Lenteur et vigilance requises",
        explanationAr: "البطء واليقظة مطلوبان",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Pour demi-tour en U:",
        questionTextAr: "للانعطاف على شكل U:",
        options: ["Vérifier autorisé et sécurité", "Tourner vite", "Pas de vérification", "N'importe où"],
        optionsAr: ["التحقق من الإذن والأمان", "انعطاف سريع", "بدون تحقق", "في أي مكان"],
        correctAnswer: 0,
        explanation: "Autorisation et sécurité d'abord",
        explanationAr: "الإذن والأمان أولاً",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Dépassement d'un véhicule:",
        questionTextAr: "تجاوز مركبة:",
        options: ["Vérifier sécurité et signaler", "Dépasser vite", "Ne pas regarder", "Klaxonner seulement"],
        optionsAr: ["التحقق من الأمان والإشارة", "تجاوز سريع", "عدم النظر", "الزمور فقط"],
        correctAnswer: 0,
        explanation: "Sécurité et signal essentiels",
        explanationAr: "الأمان والإشارة ضروريان",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Dépassement par la droite:",
        questionTextAr: "التجاوز من اليمين:",
        options: ["Interdit sauf cas spéciaux", "Toujours permis", "Permis en ville", "Recommandé"],
        optionsAr: ["ممنوع إلا حالات خاصة", "مسموح دائماً", "مسموح في المدن", "مستحسن"],
        correctAnswer: 0,
        explanation: "Généralement interdit",
        explanationAr: "ممنوع عموماً",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Stationnement en créneau:",
        questionTextAr: "الوقوف الموازي:",
        options: ["Lentement avec rétroviseurs", "Entrer vite", "Ne pas regarder", "Klaxonner"],
        optionsAr: ["ببطء مع المرايا", "دخول سريع", "عدم النظر", "الزمور"],
        correctAnswer: 0,
        explanation: "Précision et lenteur nécessaires",
        explanationAr: "الدقة والبطء ضروريان",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Sortir d'un stationnement:",
        questionTextAr: "الخروج من موقف:",
        options: ["Signaler et céder", "Sortir vite", "Ne pas regarder", "Klaxonner"],
        optionsAr: ["الإشارة والأولوية", "خروج سريع", "عدم النظر", "الزمور"],
        correctAnswer: 0,
        explanation: "Céder passage en sortant",
        explanationAr: "إعطاء الأولوية عند الخروج",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Changer de voie nécessite:",
        questionTextAr: "تغيير المسار يتطلب:",
        options: ["Signal et vérification", "Changement direct", "Vitesse élevée", "Rien"],
        optionsAr: ["إشارة وتحقق", "تغيير مباشر", "سرعة عالية", "لا شيء"],
        correctAnswer: 0,
        explanation: "Signal et vérification obligatoires",
        explanationAr: "الإشارة والتحقق إلزاميان",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Insertion sur autoroute:",
        questionTextAr: "الاندماج في الطريق السريع:",
        options: ["Voie d'accélération", "Entrée directe", "Arrêt", "Rester lent"],
        optionsAr: ["مسلك التسارع", "دخول مباشر", "توقف", "البقاء بطيئاً"],
        correctAnswer: 0,
        explanation: "Utiliser voie d'accélération",
        explanationAr: "استعمال مسلك التسارع",
        category: "conduite",
        difficulty: "moyen"
      },
      {
        questionText: "Angle mort est:",
        questionTextAr: "النقطة العمياء هي:",
        options: ["Zone non visible rétroviseurs", "Devant véhicule", "Derrière véhicule", "N'existe pas"],
        optionsAr: ["منطقة غير مرئية بالمرايا", "أمام المركبة", "خلف المركبة", "غير موجودة"],
        correctAnswer: 0,
        explanation: "Zone non couverte par rétroviseurs",
        explanationAr: "منطقة غير مغطاة بالمرايا",
        category: "conduite",
        difficulty: "moyen"
      }
    ]
  },

  // TEST 10: Examen Final Complet (Premium)
  {
    config: {
      title: "Test 10: Examen Final Complet - Niveau Avancé",
      description: "Test final couvrant tous les sujets - niveau avancé pour validation complète",
      category: "general",
      difficulty: "difficile",
      duration: 40,
      passThreshold: 80,
      isPremium: true
    },
    questions: [
      {
        questionText: "Élément le plus important en sécurité routière:",
        questionTextAr: "أهم عنصر في السلامة المرورية:",
        options: ["Conducteur responsable", "Vitesse", "Type de véhicule", "Route"],
        optionsAr: ["السائق المسؤول", "السرعة", "نوع المركبة", "الطريق"],
        correctAnswer: 0,
        explanation: "Conducteur conscient = base sécurité",
        explanationAr: "السائق الواعي = أساس السلامة",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "En cas d'accident, première action:",
        questionTextAr: "في حالة حادث، أول إجراء:",
        options: ["Sécuriser les lieux", "Appeler assurance", "Quitter les lieux", "Photographier"],
        optionsAr: ["تأمين مكان الحادث", "الاتصال بالتأمين", "مغادرة المكان", "التصوير"],
        correctAnswer: 0,
        explanation: "Sécurité prioritaire",
        explanationAr: "الأمان أولوية",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Assurance obligatoire couvre:",
        questionTextAr: "التأمين الإلزامي يغطي:",
        options: ["Dommages aux tiers", "Votre véhicule", "Tout", "Rien"],
        optionsAr: ["أضرار الغير", "مركبتك", "كل شيء", "لا شيء"],
        correctAnswer: 0,
        explanation: "Responsabilité civile uniquement",
        explanationAr: "المسؤولية المدنية فقط",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Consommation carburant augmente avec:",
        questionTextAr: "استهلاك الوقود يزداد مع:",
        options: ["Vitesse élevée et accélérations", "Vitesse lente", "Conduite calme", "Pas de différence"],
        optionsAr: ["السرعة العالية والتسارع", "السرعة البطيئة", "القيادة الهادئة", "لا فرق"],
        correctAnswer: 0,
        explanation: "Conduite agressive = plus de carburant",
        explanationAr: "القيادة العدوانية = وقود أكثر",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Écoconduite signifie:",
        questionTextAr: "القيادة الاقتصادية تعني:",
        options: ["Conduite fluide à vitesse stable", "Très lentement", "Très vite", "Accélérer/freiner"],
        optionsAr: ["قيادة سلسة بسرعة ثابتة", "ببطء شديد", "بسرعة عالية", "تسارع/فرملة"],
        correctAnswer: 0,
        explanation: "Fluidité et régularité",
        explanationAr: "السلاسة والانتظام",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Sortie de route causée par:",
        questionTextAr: "الخروج عن الطريق سببه:",
        options: ["Inattention ou fatigue", "Vitesse lente", "Route droite", "Beau temps"],
        optionsAr: ["عدم الانتباه أو التعب", "السرعة البطيئة", "الطريق المستقيم", "الطقس الجيد"],
        correctAnswer: 0,
        explanation: "Inattention = danger majeur",
        explanationAr: "عدم الانتباه = خطر كبير",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Longs trajets nécessitent:",
        questionTextAr: "المسافات الطويلة تتطلب:",
        options: ["Pauses régulières", "Conduite continue", "Accélération", "Téléphone"],
        optionsAr: ["استراحات منتظمة", "قيادة متواصلة", "تسارع", "هاتف"],
        correctAnswer: 0,
        explanation: "Pauses pour concentration",
        explanationAr: "استراحات للتركيز",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Meilleure position de conduite:",
        questionTextAr: "أفضل وضعية للقيادة:",
        options: ["Droite avec distance confortable", "Très proche", "Très loin", "Penché"],
        optionsAr: ["مستقيمة مع مسافة مريحة", "قريبة جداً", "بعيدة جداً", "منحنية"],
        correctAnswer: 0,
        explanation: "Posture correcte = moins de fatigue",
        explanationAr: "الوضعية الصحيحة = تعب أقل",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Environnement et conduite:",
        questionTextAr: "البيئة والقيادة:",
        options: ["Conduite calme réduit pollution", "Vitesse protège environnement", "Pas de lien", "Accélération meilleure"],
        optionsAr: ["القيادة الهادئة تقلل التلوث", "السرعة تحمي البيئة", "لا علاقة", "التسارع أفضل"],
        correctAnswer: 0,
        explanation: "Écoconduite = moins de pollution",
        explanationAr: "القيادة البيئية = تلوث أقل",
        category: "general",
        difficulty: "difficile"
      },
      {
        questionText: "Règle la plus importante:",
        questionTextAr: "أهم قاعدة في القيادة:",
        options: ["Respecter loi et autrui", "Vitesse", "Ne pas s'arrêter", "Course"],
        optionsAr: ["احترام القانون والآخرين", "السرعة", "عدم التوقف", "السباق"],
        correctAnswer: 0,
        explanation: "Respect = conduite sûre et responsable",
        explanationAr: "الاحترام = قيادة آمنة ومسؤولة",
        category: "general",
        difficulty: "difficile"
      }
    ]
  }
];

// Main seed function
async function seedAllTests() {
  try {
    console.log('\n🗑️  Nettoyage de la base de données...');
    await Test.deleteMany({});
    await Question.deleteMany({});
    console.log('✓ Base nettoyée\n');

    console.log('🌱 Création des 10 tests professionnels...\n');

    let totalTests = 0;
    let totalQuestions = 0;

    for (let i = 0; i < allTestsData.length; i++) {
      const { config, questions } = allTestsData[i];
      
      console.log(`📝 Test ${i + 1}/10: ${config.title}`);
      console.log(`   Catégorie: ${config.category} | Difficulté: ${config.difficulty} | Premium: ${config.isPremium ? 'Oui' : 'Non'}`);
      
      // Create questions
      const createdQuestions = await Question.insertMany(questions);
      console.log(`   ✓ ${createdQuestions.length} questions créées`);
      
      // Create test
      await Test.create({
        ...config,
        questions: createdQuestions.map(q => q._id)
      });
      
      console.log(`   ✓ Test créé avec succès\n`);
      
      totalTests++;
      totalQuestions += createdQuestions.length;
    }

    console.log('═══════════════════════════════════════');
    console.log('✅ MIGRATION RÉUSSIE!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 ${totalTests} tests créés`);
    console.log(`📝 ${totalQuestions} questions créées`);
    console.log(`⭐ ${allTestsData.filter(t => t.config.isPremium).length} tests Premium`);
    console.log(`🆓 ${allTestsData.filter(t => !t.config.isPremium).length} tests Gratuits`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('📋 Récapitulatif des tests:');
    allTestsData.forEach((test, i) => {
      const icon = test.config.isPremium ? '⭐' : '🆓';
      console.log(`   ${icon} Test ${i + 1}: ${test.config.title.split(':')[1].trim()} (${test.config.difficulty})`);
    });
    
    console.log('\n✨ Votre plateforme est prête!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}
