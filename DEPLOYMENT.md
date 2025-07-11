# 🚀 Guide de déploiement Jarvi

Ce guide vous aidera à déployer Jarvi en production avec les configurations optimisées.

## 📋 Prérequis

- Compte [Railway](https://railway.app)
- Compte [Vercel](https://vercel.com)
- Git configuré
- Node.js / Bun installé localement

## 🔧 Configuration des ports

- **Frontend local** : `http://localhost:3000` (Next.js)
- **Backend local** : `http://localhost:3001` (Elysia)
- **Production** : Ports dynamiques assignés par les plateformes

## 🔧 ÉTAPE 1 : Déploiement du Backend (Railway)

### 1.1 Installation Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### 1.2 Déploiement

```bash
# Dans le dossier backend/
cd backend

# Créer un nouveau projet
railway new
# Choisir: "Empty Project"
# Nom suggéré: "jarvi-backend"

# Lier le projet
railway link

# ⚠️ PAS BESOIN d'ajouter une DB - vous utilisez déjà Nhost
# Votre DATABASE_URL externe est déjà configurée dans env.ts

# Déployer (utilise le Dockerfile optimisé)
railway up
```

### 1.3 Configuration des variables d'environnement

```bash
# Configurer la production
railway variables set NODE_ENV=production

# ✅ Votre DATABASE_URL est déjà configurée dans le code (Nhost)
# Vous pouvez la surcharger si nécessaire avec:
# railway variables set DATABASE_URL="votre_nouvelle_url_si_besoin"

# Vérifier la configuration
railway variables
```

### 1.4 Vérification

```bash
# Obtenir l'URL de votre backend
railway domain

# Tester l'API
curl https://votre-app.up.railway.app/
```

## 🌐 ÉTAPE 2 : Déploiement du Frontend (Vercel)

### 2.1 Installation Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 2.2 Configuration environnement

```bash
# Dans le dossier frontend/
cd ../frontend

# Copier le fichier d'exemple
cp env.example .env.local

# Éditer .env.local avec l'URL de votre backend Railway
# NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app/api
```

### 2.3 Déploiement

```bash
# Premier déploiement
vercel

# Suivre les instructions:
# - Setup and deploy? Y
# - Which scope? (votre compte)
# - Link to existing project? N
# - Project name: jarvi-frontend
# - In which directory? ./
# - Override settings? N
```

### 2.4 Configuration des variables Vercel

```bash
# Configurer la variable d'environnement de production
vercel env add NEXT_PUBLIC_API_URL

# Entrer l'URL de votre backend:
# https://votre-backend.up.railway.app/api

# Redéployer avec les nouvelles variables
vercel --prod
```

## ✅ ÉTAPE 3 : Vérification finale

### 3.1 Test du backend

```bash
curl https://votre-backend.up.railway.app/
```

Réponse attendue :
```json
{
  "message": "Jarvi Stats API",
  "version": "1.0.0",
  "timestamp": "2024-12-19T..."
}
```

### 3.2 Test du frontend

1. Visitez : `https://votre-frontend.vercel.app`
2. Vérifiez que les données se chargent
3. Testez les filtres de date et projets

## 🔧 Scripts utiles

### Backend

```bash
# Build local pour test
bun run build        # Compile en binaire
bun run build:js     # Compile en JavaScript
bun run start:binary # Lance le binaire

# Développement
bun run dev          # Mode développement
bun run type-check   # Vérification TypeScript
```

### Frontend

```bash
# Build et prévisualisation
npm run build
npm run start

# Développement
npm run dev
```

## 🐳 Déploiement Docker (Alternative)

Si vous préférez Docker :

```bash
# Backend
cd backend
docker build -t jarvi-backend .
docker run -p 3001:3001 -e DATABASE_URL="your_db_url" jarvi-backend

# Frontend
cd frontend
docker build -t jarvi-frontend .
docker run -p 3000:3000 jarvi-frontend
```

## 📊 Optimisations

- **Backend** : Compilé en binaire optimisé (2-3x moins de mémoire)
- **Frontend** : Build Next.js optimisé pour Vercel
- **Base de données** : Nhost PostgreSQL (externe - déjà configurée)
- **CORS** : Configuré pour tous les domaines `.vercel.app`

## 🆘 Dépannage

### Backend ne démarre pas
- Vérifiez `railway logs`
- Votre DATABASE_URL Nhost est automatiquement utilisée
- Testez localement avec `bun run build && ./server`

### Frontend ne se connecte pas au backend
- Vérifiez `NEXT_PUBLIC_API_URL` dans Vercel
- Testez l'URL backend directement
- Vérifiez la console du navigateur pour les erreurs CORS

### Erreur de base de données
- Vérifiez que votre base Nhost est accessible
- Testez la connection avec un client PostgreSQL
- Vérifiez les migrations : `bun run db:migrate`

## 🔄 Déploiements futurs

```bash
# Backend
cd backend
git push  # Railway redéploie automatiquement

# Frontend  
cd frontend
git push  # Vercel redéploie automatiquement

# Ou manuellement:
vercel --prod
railway up
```

## 📱 URLs finales

- **Frontend** : `https://jarvi-frontend.vercel.app`
- **Backend** : `https://jarvi-backend.up.railway.app`
- **API Docs** : `https://jarvi-backend.up.railway.app/swagger`
- **Base de données** : Nhost (externe - aucune action requise)

Votre application Jarvi est maintenant en production ! 🎉