# Jarvi Statistics Dashboard

Une application full-stack pour analyser les taux de réponse des différents types de messages (Email, LinkedIn Message, LinkedIn InMail) afin d'optimiser les méthodes d'approche commerciale.

## 📋 Fonctionnalités

- **Comparaison des canaux** : Visualisation des taux de réponse entre Email, Messages LinkedIn et InMails LinkedIn
- **Sélection de période** : Analyse sur 7, 30 ou 90 jours
- **Comparaison temporelle** : Évolution par rapport à la période précédente
- **Filtrage par projet** : Analyse par projet spécifique (optionnel)
- **Interface moderne** : Dashboard responsive avec graphiques interactifs

## 🏗️ Architecture

### Frontend
- **Next.js 15** avec TypeScript
- **React Query** pour la gestion des données
- **Zustand** pour l'état global
- **Tailwind CSS** + **Radix UI** pour l'interface
- **Recharts** pour les graphiques

### Backend  
- **Bun** avec **Elysia.js**
- **Drizzle ORM** pour la base de données
- **PostgreSQL** comme base de données
- **TypeScript** avec types partagés

### Shared
- **Types TypeScript** partagés entre frontend et backend

## 🚀 Installation et Setup

### Prérequis
- [Bun](https://bun.sh/) (recommandé) ou Node.js 18+
- PostgreSQL (ou accès à une base PostgreSQL distante)

### 1. Cloner le repository

### 2. Installation des dépendances
```bash
# Installation pour tous les packages
bun install

# Ou individuellement
cd backend && bun install
cd ../frontend && bun install  
cd ../shared && bun install
```

### 3. Configuration des variables d'environnement

#### Backend (.env)
Créer un fichier `.env` dans le dossier `backend/` :
```bash
# Base de données PostgreSQL
DATABASE_URL="xxxx"

# Port du serveur backend
PORT="3001"
```

#### Frontend (.env.local)
Créer un fichier `.env.local` dans le dossier `frontend/` :
```bash
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Démarrage des services

#### Démarrer le backend
```bash
cd backend
bun run dev
```
Le backend sera accessible sur `http://localhost:3001`

#### Démarrer le frontend  
```bash
cd frontend
bun run dev
```
Le frontend sera accessible sur `http://localhost:3000`

## 📊 Utilisation

1. **Accéder au dashboard** : Ouvrir `http://localhost:3000/statistics`

2. **Sélectionner une période** : Utiliser le sélecteur de période

3. **Analyser les résultats** :
   - **Cartes de statistiques** : Vue d'ensemble des taux de réponse
   - **Graphique de comparaison** : Visualisation des performances par canal
   - **Comparaison temporelle** : Évolution par rapport à la période précédente
```