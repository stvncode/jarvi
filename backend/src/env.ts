// Configuration des variables d'environnement
export const env = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:2p9fXdxyMAqSCcGG@ymildvxmidpgiiakgohs.db.eu-central-1.nhost.run:5432/ymildvxmidpgiiakgohs',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 