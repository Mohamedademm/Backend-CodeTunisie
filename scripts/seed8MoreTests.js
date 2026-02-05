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
    console.log('\n📝 Ajout de 8 nouveaux tests...\n');

    const testsData = [
      // Test 3
      {
        title: "Test 3: Priorités et Croisements",
        description: "Test spécialisé sur les règles de priorité",
        category: "priorites",
        difficulty: "moyen",
        duration: 20,
        passThreshold: 75,
        questions: [
          {
            question: "À un rond-point, qui a la priorité?",
            options: ["Véhicules dans le rond-point", "Véhicules qui entrent", "Le plus rapide", "Le plus grand"],
            correctAnswer: 0,
            explanation: "Priorité aux véhicules déjà dans le rond-point",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Ligne continue blanche signifie:",
            options: ["Interdiction de dépasser", "Route glissante", "Stationnement interdit", "Zone piétonne"],
            correctAnswer: 0,
            explanation: "Ligne continue = interdiction de franchir",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Feu orange clignotant indique:",
            options: ["Prudence, carrefour dangereux", "Arrêt obligatoire", "Passage libre", "Feu hors service"],
            correctAnswer: 0,
            explanation: "Orange clignotant = prudence accrue",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Dépassement interdit dans:",
            options: ["Toutes ces situations", "Virage sans visibilité", "Sommet de côte", "Passage piéton"],
            correctAnswer: 0,
            explanation: "Dépassement interdit dans zones dangereuses",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Vous voyez un bus scolaire arrêté:",
            options: ["Ralentir et être prudent", "Klaxonner", "Dépasser rapidement", "Continuer normalement"],
            correctAnswer: 0,
            explanation: "Attention aux enfants qui traversent",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "En montée étroite, qui a priorité?",
            options: ["Véhicule qui monte", "Véhicule qui descend", "Le plus rapide", "Le plus lourd"],
            correctAnswer: 0,
            explanation: "Priorité au véhicule montant",
            category: "priorites",
            difficulty: "difficile"
          },
          {
            question: "Véhicule prioritaire (police, ambulance):",
            options: ["Toujours prioritaire", "Seulement avec sirène", "Seulement de jour", "Seulement en ville"],
            correctAnswer: 1,
            explanation: "Prioritaire avec signaux sonores et lumineux",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Passage pour piétons:",
            options: ["Céder passage toujours", "Klaxonner si lent", "Priorité au véhicule", "Seulement si feu"],
            correctAnswer: 0,
            explanation: "Piétons toujours prioritaires sur passage",
            category: "priorites",
            difficulty: "facile"
          },
          {
            question: "Marquage au sol en zigzag jaune:",
            options: ["Stationnement interdit", "Route glissante", "Zone scolaire", "Ralentisseur"],
            correctAnswer: 0,
            explanation: "Zigzag jaune = interdiction de stationner",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Convergence de voies (comme zipper):",
            options: ["Alternance courtoise", "Priorité à gauche", "Priorité à droite", "Le plus rapide"],
            correctAnswer: 0,
            explanation: "Fusion en alternance un par un",
            category: "priorites",
            difficulty: "moyen"
          }
        ]
      },
      // Test 4
      {
        title: "Test 4: Sécurité Routière Avancée",
        description: "Maîtrisez les règles de sécurité avancées",
        category: "securite",
        difficulty: "difficile",
        duration: 25,
        passThreshold: 80,
        questions: [
          {
            question: "Distance de freinage sur route mouillée:",
            options: ["Double de la distance normale", "Identique", "Réduite de moitié", "Légèrement plus longue"],
            correctAnswer: 0,
            explanation: "Route mouillée = distance × 2",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "ABS (système anti-blocage) permet:",
            options: ["Freiner en gardant direction", "Freiner plus vite", "Économiser freins", "Éviter aquaplaning"],
            correctAnswer: 0,
            explanation: "ABS évite blocage et perte de contrôle",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Aquaplaning se produit quand:",
            options: ["Eau entre pneu et route", "Freins mouillés", "Visibilité réduite", "Pluie forte"],
            correctAnswer: 0,
            explanation: "Film d'eau fait perdre adhérence",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Contrôler les angles morts avant:",
            options: ["Changement de voie", "Freinage", "Accélération", "Feu rouge"],
            correctAnswer: 0,
            explanation: "Vérifier avant tout changement de direction",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Feux de brouillard arrière à utiliser:",
            options: ["Visibilité < 50m", "Toujours de nuit", "Sur autoroute", "En ville"],
            correctAnswer: 0,
            explanation: "Seulement si visibilité très réduite",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Airbag se déclenche:",
            options: ["Choc frontal violent", "Tout petit choc", "Freinage brusque", "Virage serré"],
            correctAnswer: 0,
            explanation: "Activation sur impact majeur",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Profondeur minimale des rainures de pneus:",
            options: ["1.6 mm", "3 mm", "5 mm", "0.5 mm"],
            correctAnswer: 0,
            explanation: "Limite légale 1.6mm",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Enfant < 10 ans doit être:",
            options: ["Siège adapté à l'arrière", "Siège avant", "Sans siège si grand", "Sur genoux"],
            correctAnswer: 0,
            explanation: "Dispositif adapté obligatoire",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "ESP (contrôle de stabilité) aide à:",
            options: ["Éviter dérapage", "Freiner plus vite", "Économiser carburant", "Voir la nuit"],
            correctAnswer: 0,
            explanation: "ESP corrige trajectoire",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Triangle de signalisation à placer:",
            options: ["30m derrière véhicule", "Sous le véhicule", "Dans coffre", "10m devant"],
            correctAnswer: 0,
            explanation: "30m pour avertir autres conducteurs",
            category: "securite",
            difficulty: "moyen"
          }
        ]
      },
      // Test 5
      {
        title: "Test 5: Conduite en Ville",
        description: "Situations de conduite urbaine",
        category: "conduite",
        difficulty: "facile",
        duration: 15,
        passThreshold: 70,
        questions: [
          {
            question: "En agglomération, vitesse max:",
            options: ["50 km/h", "60 km/h", "70 km/h", "40 km/h"],
            correctAnswer: 0,
            explanation: "50 km/h en ville",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Stationnement sur trottoir:",
            options: ["Interdit sauf indication", "Toujours autorisé", "Autorisé de nuit", "Autorisé si large"],
            correctAnswer: 0,
            explanation: "Trottoir = piétons uniquement",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Klaxon en ville autorisé:",
            options: ["Danger immédiat uniquement", "Toujours", "De jour", "Pour saluer"],
            correctAnswer: 0,
            explanation: "Klaxon seulement si danger",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Ligne jaune sur trottoir signifie:",
            options: ["Arrêt interdit", "Zone piétonne", "Stationnement payant", "Taxi uniquement"],
            correctAnswer: 0,
            explanation: "Jaune = interdiction d'arrêt",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Feu vert pour piétons, vous tournez:",
            options: ["Céder passage piétons", "Priorité au véhicule", "Klaxonner", "Accélérer"],
            correctAnswer: 0,
            explanation: "Piétons prioritaires même si feu vert",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Distance de stationnement d'un passage piéton:",
            options: ["5 mètres minimum", "2 mètres", "Collé possible", "10 mètres"],
            correctAnswer: 0,
            explanation: "5m avant le passage",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Zone bleue de stationnement:",
            options: ["Durée limitée avec disque", "Gratuit illimité", "Résidents seulement", "Interdit"],
            correctAnswer: 0,
            explanation: "Stationnement limité dans le temps",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Rue à sens unique, reculer:",
            options: ["Interdit", "Autorisé sur 50m", "Toujours autorisé", "Autorisé de nuit"],
            correctAnswer: 0,
            explanation: "Marche arrière interdite en sens unique",
            category: "conduite",
            difficulty: "difficile"
          },
          {
            question: "Voie de bus avec marquage:",
            options: ["Interdite aux autres", "Autorisée si libre", "Autorisée aux taxis", "Autorisée le dimanche"],
            correctAnswer: 0,
            explanation: "Voie réservée aux bus",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Demi-tour en ville:",
            options: ["Interdit sauf indication", "Toujours autorisé", "Autorisé aux carrefours", "Autorisé de nuit"],
            correctAnswer: 0,
            explanation: "Demi-tour généralement interdit",
            category: "conduite",
            difficulty: "moyen"
          }
        ]
      },
      // Test 6 - PREMIUM
      {
        title: "Test 6: Expert - Code de la Route 🌟",
        description: "Test complet niveau expert avec cas complexes",
        category: "mecanique",
        difficulty: "difficile",
        duration: 40,
        passThreshold: 85,
        isPremium: true,
        questions: [
          {
            question: "Accident avec blessés, première action:",
            options: ["Sécuriser zone et appeler urgences", "Déplacer véhicules", "Prendre photos", "Partir si pas responsable"],
            correctAnswer: 0,
            explanation: "Sécurité et secours prioritaires",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Alcool dans le sang se dissipe:",
            options: ["0.15 g/L par heure", "Rapidement avec café", "Vite avec exercice", "En 30 minutes"],
            correctAnswer: 0,
            explanation: "Élimination très lente 0.15g/h",
            category: "regles",
            difficulty: "difficile"
          },
          {
            question: "Distance de sécurité sur autoroute:",
            options: ["2 secondes minimum", "10 mètres", "50 mètres", "1 seconde"],
            correctAnswer: 0,
            explanation: "Règle des 2 secondes",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Panne sur autoroute, vous devez:",
            options: ["Toutes ces actions", "Gilet jaune", "Triangle à 30m", "Sortir côté sécurité"],
            correctAnswer: 0,
            explanation: "Protocole complet de sécurité",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Permis à points, capital initial:",
            options: ["12 points", "10 points", "6 points", "20 points"],
            correctAnswer: 0,
            explanation: "12 points en Tunisie",
            category: "regles",
            difficulty: "moyen"
          },
          {
            question: "Vitesse excessive = perte de combien de points:",
            options: ["4 points", "1 point", "2 points", "6 points"],
            correctAnswer: 0,
            explanation: "Excès de vitesse = 4 points",
            category: "regles",
            difficulty: "difficile"
          },
          {
            question: "Refus de priorité = perte de:",
            options: ["4 points", "2 points", "6 points", "1 point"],
            correctAnswer: 0,
            explanation: "Infraction grave = 4 points",
            category: "regles",
            difficulty: "difficile"
          },
          {
            question: "Conduite sans permis = sanction:",
            options: ["Amende + prison possible", "Simple amende", "Avertissement", "Suspension"],
            correctAnswer: 0,
            explanation: "Délit pénal grave",
            category: "regles",
            difficulty: "difficile"
          },
          {
            question: "Contrôle technique obligatoire tous les:",
            options: ["2 ans pour véhicules > 4 ans", "1 an", "5 ans", "3 ans"],
            correctAnswer: 0,
            explanation: "Contrôle bisannuel après 4 ans",
            category: "regles",
            difficulty: "difficile"
          },
          {
            question: "Assurance minimum obligatoire:",
            options: ["Responsabilité civile", "Tous risques", "Vol et incendie", "Dommages corporels"],
            correctAnswer: 0,
            explanation: "RC obligatoire pour circuler",
            category: "regles",
            difficulty: "moyen"
          }
        ]
      },
      // Test 7
      {
        title: "Test 7: Autoroute et Routes Rapides",
        description: "Conduite sur voies rapides",
        category: "conduite",
        difficulty: "moyen",
        duration: 20,
        passThreshold: 75,
        questions: [
          {
            question: "Vitesse max sur autoroute:",
            options: ["110 km/h", "120 km/h", "100 km/h", "130 km/h"],
            correctAnswer: 0,
            explanation: "110 km/h sur autoroute tunisienne",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Bande d'arrêt d'urgence pour:",
            options: ["Urgence uniquement", "Dépassement", "Repos", "Téléphone"],
            correctAnswer: 0,
            explanation: "Réservée aux urgences",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Faire demi-tour sur autoroute:",
            options: ["Strictement interdit", "Autorisé aux échangeurs", "Autorisé si prudent", "Autorisé de nuit"],
            correctAnswer: 0,
            explanation: "Demi-tour = danger mortel",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Voie de gauche sur autoroute pour:",
            options: ["Dépassement uniquement", "Rouler vite", "Véhicules légers", "Résidents"],
            correctAnswer: 0,
            explanation: "Gauche = dépassement seulement",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Entrée sur autoroute, vous devez:",
            options: ["Accélérer sur voie insertion", "S'arrêter puis entrer", "Priorité sur autoroute", "Klaxonner"],
            correctAnswer: 0,
            explanation: "Adapter vitesse sur voie d'insertion",
            category: "conduite",
            difficulty: "moyen"
          },
          {
            question: "Fatigue sur autoroute:",
            options: ["Pause toutes les 2h", "Continuer prudemment", "Café suffit", "Fenêtre ouverte"],
            correctAnswer: 0,
            explanation: "Pause régulière obligatoire",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Panneau 'Aire repos 2km' signifie:",
            options: ["Repos possible dans 2km", "Repos obligatoire", "Vitesse limitée", "Péage proche"],
            correctAnswer: 0,
            explanation: "Information de service",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Marche arrière sur autoroute:",
            options: ["Totalement interdit", "Autorisé 50m", "Si erreur sortie", "Bande urgence OK"],
            correctAnswer: 0,
            explanation: "Marche arrière = danger extrême",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Véhicule lent sur autoroute:",
            options: ["Rester à droite", "Voie du milieu", "Selon circulation", "Voie de gauche"],
            correctAnswer: 0,
            explanation: "Véhicules lents toujours à droite",
            category: "conduite",
            difficulty: "facile"
          },
          {
            question: "Brouillard dense sur autoroute:",
            options: ["Ralentir, feux brouillard", "Vitesse normale", "Suivre véhicule", "Bande urgence"],
            correctAnswer: 0,
            explanation: "Adapter vitesse à visibilité",
            category: "securite",
            difficulty: "moyen"
          }
        ]
      },
      // Test 8
      {
        title: "Test 8: Situations d'Urgence",
        description: "Réagir aux situations dangereuses",
        category: "securite",
        difficulty: "moyen",
        duration: 20,
        passThreshold: 75,
        questions: [
          {
            question: "Freins défaillants en descente:",
            options: ["Frein moteur + frein main", "Accélérer", "Point mort", "Continuer"],
            correctAnswer: 0,
            explanation: "Frein moteur prioritaire",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Pneu éclate en roulant:",
            options: ["Tenir volant, ralentir progressivement", "Freiner fort", "Tourner vite", "Accélérer"],
            correctAnswer: 0,
            explanation: "Garder contrôle et ralentir doucement",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Témoin rouge moteur s'allume:",
            options: ["Arrêter moteur rapidement", "Continuer si pas de bruit", "Accélérer au garage", "Ignorer"],
            correctAnswer: 0,
            explanation: "Risque de casse moteur",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Fumée sort du capot:",
            options: ["Arrêt, extinction, évacuation", "Ouvrir capot", "Continuer au garage", "Mettre eau"],
            correctAnswer: 0,
            explanation: "Risque d'incendie - évacuer",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Accélérateur bloqué:",
            options: ["Débrayage + frein", "Point mort", "Continuer", "Couper contact"],
            correctAnswer: 0,
            explanation: "Débrayer d'abord pour freiner",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Véhicule prend feu:",
            options: ["Évacuer puis extincteur", "Chercher extincteur", "Appeler d'abord", "Déplacer véhicule"],
            correctAnswer: 0,
            explanation: "Sécurité personnes prioritaire",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Aquaplaning ressenti:",
            options: ["Lâcher accélérateur, pas de frein", "Freiner fort", "Accélérer", "Tourner vite"],
            correctAnswer: 0,
            explanation: "Laisser pneus retrouver adhérence",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Témoin batterie allumé:",
            options: ["Problème alternateur", "Batterie vide", "Phares défectueux", "Radio cassée"],
            correctAnswer: 0,
            explanation: "Alternateur ne charge plus",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Animal traverse subitement:",
            options: ["Freiner sans écart brusque", "Éviter à tout prix", "Klaxonner", "Accélérer"],
            correctAnswer: 0,
            explanation: "Écart = danger plus grand",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Volant tremble à haute vitesse:",
            options: ["Équilibrage ou pneu défectueux", "Normal", "Suspension OK", "Freins"],
            correctAnswer: 0,
            explanation: "Problème pneus ou équilibrage",
            category: "securite",
            difficulty: "moyen"
          }
        ]
      },
      // Test 9
      {
        title: "Test 9: Éco-conduite et Entretien",
        description: "Conduite économique et maintenance",
        category: "mecanique",
        difficulty: "facile",
        duration: 15,
        passThreshold: 70,
        questions: [
          {
            question: "Pour économiser carburant:",
            options: ["Conduite souple et anticipative", "Accélérations brutales", "Vitesse maximale", "Point mort en descente"],
            correctAnswer: 0,
            explanation: "Conduite douce = économie",
            category: "mecanique",
            difficulty: "facile"
          },
          {
            question: "Pression pneus incorrecte cause:",
            options: ["Surconsommation", "Meilleure tenue", "Plus de confort", "Rien"],
            correctAnswer: 0,
            explanation: "Sous-gonflage = +5% consommation",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Climatisation augmente consommation de:",
            options: ["10-20%", "2-3%", "50%", "Pas d'impact"],
            correctAnswer: 0,
            explanation: "Clim = surconsommation importante",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Niveau d'huile moteur à vérifier:",
            options: ["Moteur froid régulièrement", "Jamais nécessaire", "Une fois par an", "Garage seulement"],
            correctAnswer: 0,
            explanation: "Contrôle régulier essentiel",
            category: "mecanique",
            difficulty: "facile"
          },
          {
            question: "Vidange huile moteur recommandée:",
            options: ["Selon constructeur (10-15k km)", "100 000 km", "Jamais", "Tous les ans obligatoire"],
            correctAnswer: 0,
            explanation: "Suivre préconisations constructeur",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Liquide refroidissement bas:",
            options: ["Risque surchauffe moteur", "Pas grave", "Normal l'été", "Meilleure performance"],
            correctAnswer: 0,
            explanation: "Refroidissement vital pour moteur",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Filtre à air encrassé provoque:",
            options: ["Surconsommation", "Meilleur rendement", "Plus de puissance", "Rien"],
            correctAnswer: 0,
            explanation: "Filtre sale = moins d'air = surconsommation",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Liquide lave-glace:",
            options: ["Spécial pare-brise", "Eau savonneuse", "Eau seule suffit", "Alcool pur"],
            correctAnswer: 0,
            explanation: "Produit adapté évite traces",
            category: "mecanique",
            difficulty: "facile"
          },
          {
            question: "Plaquettes de frein usées:",
            options: ["Bruit métallique au freinage", "Silence total", "Meilleur freinage", "Rien"],
            correctAnswer: 0,
            explanation: "Grincement = usure critique",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Régime moteur économique:",
            options: ["2000-2500 tours/min", "5000 tours/min", "Ralenti", "Maximum"],
            correctAnswer: 0,
            explanation: "Régime moyen = meilleur rendement",
            category: "mecanique",
            difficulty: "moyen"
          }
        ]
      },
      // Test 10 - PREMIUM
      {
        title: "Test 10: Master - Examen Final 🏆",
        description: "Test ultime - Tous les aspects du code",
        category: "mecanique",
        difficulty: "difficile",
        duration: 45,
        passThreshold: 90,
        isPremium: true,
        questions: [
          {
            question: "Temps de réaction moyen d'un conducteur:",
            options: ["1 seconde", "0.1 seconde", "3 secondes", "5 secondes"],
            correctAnswer: 0,
            explanation: "1 seconde en conditions normales",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Distance parcourue à 90 km/h pendant 1s:",
            options: ["25 mètres", "90 mètres", "10 mètres", "50 mètres"],
            correctAnswer: 0,
            explanation: "90 km/h = 25 m/s",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Cédez le passage avec panneau ET ligne:",
            options: ["S'arrêter si nécessaire", "Arrêt obligatoire", "Ralentir seulement", "Céder toujours"],
            correctAnswer: 0,
            explanation: "Arrêt si véhicule prioritaire arrive",
            category: "priorites",
            difficulty: "difficile"
          },
          {
            question: "Champ de vision réduit par vitesse:",
            options: ["Vision tunnel à haute vitesse", "Vision améliorée", "Pas d'effet", "Vision latérale augmentée"],
            correctAnswer: 0,
            explanation: "Vitesse réduit vision périphérique",
            category: "securite",
            difficulty: "difficile"
          },
          {
            question: "Facteur aggravant d'accident:",
            options: ["Tous ces facteurs", "Vitesse excessive", "Alcool", "Fatigue"],
            correctAnswer: 0,
            explanation: "Combinaison = danger extrême",
            category: "securite",
            difficulty: "moyen"
          },
          {
            question: "Code de la route vise à:",
            options: ["Protéger tous les usagers", "Punir conducteurs", "Générer amendes", "Limiter circulation"],
            correctAnswer: 0,
            explanation: "Objectif = sécurité de tous",
            category: "mecanique",
            difficulty: "facile"
          },
          {
            question: "Partage de la route signifie:",
            options: ["Respect de tous les usagers", "Priorité aux voitures", "Voitures d'abord", "Klaxonner si lent"],
            correctAnswer: 0,
            explanation: "Cohabitation respectueuse",
            category: "mecanique",
            difficulty: "moyen"
          },
          {
            question: "Vélo circule sur chaussée:",
            options: ["Droits et devoirs identiques", "Aucun droit", "Toléré seulement", "Interdit en ville"],
            correctAnswer: 0,
            explanation: "Cycliste = usager à part entière",
            category: "priorites",
            difficulty: "moyen"
          },
          {
            question: "Courtoisie au volant améliore:",
            options: ["Sécurité et fluidité", "Rien du tout", "Vitesse moyenne", "Consommation"],
            correctAnswer: 0,
            explanation: "Respect = sécurité pour tous",
            category: "mecanique",
            difficulty: "facile"
          },
          {
            question: "Responsabilité d'un conducteur:",
            options: ["Civile, pénale et administrative", "Aucune si assurance", "Civile seulement", "Pénale seulement"],
            correctAnswer: 0,
            explanation: "Triple responsabilité possible",
            category: "regles",
            difficulty: "difficile"
          }
        ]
      }
    ];

    // Create tests
    for (let i = 0; i < testsData.length; i++) {
      const testData = testsData[i];
      console.log(`📝 Création Test ${i + 3}: ${testData.title}`);
      
      const questions = await Question.insertMany(testData.questions);
      console.log(`   ✓ ${questions.length} questions créées`);
      
      await Test.create({
        title: testData.title,
        description: testData.description,
        category: testData.category,
        difficulty: testData.difficulty,
        duration: testData.duration,
        passThreshold: testData.passThreshold,
        isPremium: testData.isPremium || false,
        questions: questions.map(q => q._id)
      });
      console.log(`   ✓ Test créé${testData.isPremium ? ' 🌟 PREMIUM' : ''}\n`);
    }

    const total = await Test.countDocuments();
    const totalQ = await Question.countDocuments();
    
    console.log('✅ SUCCÈS TOTAL!');
    console.log(`📊 ${total} tests au total`);
    console.log(`📝 ${totalQ} questions au total\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}
