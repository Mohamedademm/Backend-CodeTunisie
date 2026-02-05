# CodeTunisiePro Backend

Backend API pour la plateforme d'apprentissage du code de la route tunisien.

## Technologies

- **Node.js** + **Express** - Framework backend
- **MongoDB Atlas** - Base de données cloud
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Protection contre les abus

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier .env avec vos vraies valeurs
```

## Configuration

Modifiez le fichier `.env` avec vos informations MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/codetunisie
JWT_ACCESS_SECRET=votre_secret_access
JWT_REFRESH_SECRET=votre_secret_refresh
FRONTEND_URL=http://localhost:5173
```

## Démarrage

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

## 📚 Documentation
- **API Documentation** : Disponible sur `/api-docs` (Swagger UI) une fois le serveur lancé.
- **Guide Utilisateur** : Voir [USER_GUIDE.md](../USER_GUIDE.md) pour les instructions complètes.

## Routes API

### Authentification (`/api/auth`)

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/logout` - Se déconnecter
- `GET /api/auth/me` - Obtenir le profil utilisateur

## Déploiement sur Vercel

1. Créer un compte sur [Vercel](https://vercel.com)
2. Installer Vercel CLI: `npm i -g vercel`
3. Se connecter: `vercel login`
4. Déployer: `vercel`

### Variables d'environnement sur Vercel

Dans le dashboard Vercel, ajoutez ces variables:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL` (votre URL Vercel frontend)

## Structure

```
Backend/
├── config/
│   └── database.js       # Configuration MongoDB
├── middleware/
│   ├── auth.js          # Middleware d'authentification
│   └── errorHandler.js  # Gestion des erreurs
├── models/
│   ├── User.js          # Modèle utilisateur
│   ├── Course.js        # Modèle cours
│   ├── Video.js         # Modèle vidéo
│   ├── Question.js      # Modèle question
│   ├── Test.js          # Modèle test
│   ├── TestAttempt.js   # Modèle tentative de test
│   └── Payment.js       # Modèle paiement
├── routes/
│   └── auth.js          # Routes d'authentification
├── utils/
│   └── tokenUtils.js    # Utilitaires JWT
├── .env                 # Variables d'environnement
├── .env.example         # Template des variables
├── .gitignore          # Fichiers ignorés par Git
├── server.js           # Point d'entrée
├── vercel.json         # Configuration Vercel
└── package.json        # Dépendances
```

## Licence

ISC
