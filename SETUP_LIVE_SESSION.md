# Configuration des Sessions Live

## Problème : Accès à la caméra/microphone

Les navigateurs modernes exigent une connexion HTTPS pour accéder aux API de média (caméra/microphone). Voici les solutions :

## Solution 1 : Utiliser localhost (Recommandé pour le développement)

```bash
# Démarrer le serveur
npm run dev

# Accéder via localhost
http://localhost:8080
```

**Avantage** : Fonctionne immédiatement sans configuration supplémentaire.

## Solution 2 : Utiliser HTTPS avec certificats auto-signés

```bash
# Démarrer avec HTTPS
npm run dev:https

# Accéder via HTTPS
https://localhost:8080
```

**Note** : Le navigateur affichera un avertissement de sécurité. Cliquez sur "Avancer" pour continuer.

## Solution 3 : Utiliser un tunnel HTTPS (Pour tester depuis d'autres appareils)

### Avec ngrok :
```bash
# Installer ngrok
npm install -g ngrok

# Démarrer le serveur
npm run dev

# Dans un autre terminal, créer un tunnel
ngrok http 8080

# Utiliser l'URL HTTPS fournie par ngrok
```

### Avec localtunnel :
```bash
# Installer localtunnel
npm install -g localtunnel

# Démarrer le serveur
npm run dev

# Dans un autre terminal, créer un tunnel
lt --port 8080

# Utiliser l'URL HTTPS fournie par localtunnel
```

## Solution 4 : Configuration manuelle HTTPS

Si vous voulez configurer HTTPS manuellement :

1. Installer mkcert :
```bash
# Windows (avec Chocolatey)
choco install mkcert

# Ou télécharger depuis https://github.com/FiloSottile/mkcert
```

2. Générer des certificats :
```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

3. Modifier vite.config.ts :
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    https: {
      key: fs.readFileSync("localhost+2-key.pem"),
      cert: fs.readFileSync("localhost+2.pem"),
    },
  },
  // ... reste de la config
});
```

## Dépannage

### Erreur "navigator.mediaDevices is undefined"
- Assurez-vous d'utiliser HTTPS ou localhost
- Vérifiez que le navigateur autorise l'accès à la caméra

### Erreur SSL
- Acceptez le certificat auto-signé dans le navigateur
- Ou utilisez localhost au lieu de l'IP locale

### Caméra non détectée
- Vérifiez que la caméra n'est pas utilisée par une autre application
- Autorisez l'accès dans les paramètres du navigateur

## Production

En production, utilisez un vrai certificat SSL (Let's Encrypt, etc.) pour une expérience utilisateur optimale. 