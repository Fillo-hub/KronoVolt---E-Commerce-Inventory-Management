# KronoVolt — Piattaforma E-Commerce & Gestione Inventario

Piattaforma full-stack per il commercio elettronico B2C/B2B di hardware, elettronica e cataloghi tecnici, progettata per offrire **un'esperienza d'acquisto rapida**, **comparazione prodotti in tempo reale** e un **pannello admin pulito** con gestione massiva dell'inventario.

---

## Il Problema di Business risolto

Molti e-commerce con cataloghi tecnici si bloccano su due aspetti pratici:
1. **Esperienza cliente lenta e dispersiva:** schede prodotto statiche che non permettono di confrontare facilmente specifiche, prezzi e disponibilità, aumentando l'abbandono del carrello.
2. **Gestione back-office macchinosa:** pannelli lenti e import/export CSV che si aprono su una sola colonna in Microsoft Excel, costringendo il team a sistemare manualmente listini e scorte.

**KronoVolt** risolve entrambi i problemi attraverso:
- **Comparatore Tecnico Side-by-Side (`/compare`):** confronto simultaneo fino a 4 prodotti con evidenziazione immediata del miglior prezzo e delle specifiche chiave.
- **Console Admin Real-Time & Sincronizzazione CSV/Excel (`/admin`):** pannello di controllo pulito collegato ai dati reali del database (Fatturato, valore medio ordine, scorte critiche con riassortimento in 1 clic) e import/export CSV multi-colonna compatibile nativamente con Microsoft Excel.
- **Order Tracking & Ricevuta Stampabile (`/orders`):** verifica immediata dello stato ordine tramite codice e stampa della ricevuta in autonomia, riducendo le richieste di assistenza.
- **Storefront Veloce & Responsive:** catalogo filtrabile con ricerca immediata, carrello e lista desideri persistenti (`/wishlist`), ottimizzato per desktop e smartphone.

---

## Architettura e Tech Stack

L'applicazione separa in modo pulito il frontend (storefront e pannello admin) dal server API dedicato alla logica di business e al database:

- **Frontend & UI/UX:** **Next.js**, **React**, **TypeScript** e **Tailwind CSS**, con gestione fluida dello stato di Carrello, Lista Desideri e Comparatore tramite **Zustand**.
- **Backend API:** **Node.js** ed **Express.js** con API REST dedicate, validazione input, protezione anti-abuso sugli endpoint e motore bidirezionale per importazione ed esportazione CSV.
- **Database:** **PostgreSQL** gestito con **Prisma ORM** per catalogo, ordini, utenti e aggiornamento massivo dei listini.
- **Autenticazione & Ruoli:** **NextAuth.js** con separazione netta tra area cliente (`user`) e Console Admin protetta (`admin`).
- **Pagamenti & Estensioni (Modalità Demo):** il flusso di checkout e tracciamento ordini è configurato in **modalità dimostrativa** (nessun addebito reale) ed è già predisposto per essere collegato in produzione a gateway di pagamento come **Stripe** o **PayPal** e a login OAuth (Google/GitHub).

---

## Trasparenza B2B & Personalizzazione

Questo progetto nasce da una base open-source (rilasciata sotto licenza **MIT**) ed è stato **profondamente riprogettato per scenari reali B2C/B2B e consegne white-label**:

1. **Migrazione Database a PostgreSQL:** passaggio completo da MySQL a PostgreSQL con ricerca prodotti insensibile a maiuscole/minuscole e gestione affidabile dei caricamenti massivi.
2. **Ottimizzazione delle Performance (da >60s a <1s):** intervento mirato su caricamento pagine, gestione delle connessioni al database, ottimizzazione delle immagini responsive e filtri catalogo fluidi.
3. **Nuove Funzionalità Business sviluppate su misura:**
   - **Comparatore Tecnico (`/compare`)**, **Order Tracking con Stampa Ricevuta (`/orders`)** e **Lista Desideri persistente (`/wishlist`)**.
   - **Console Admin Real-Time** collegata alle metriche reali del database, al posto della dashboard statica originale.
   - **Motore Import/Export CSV compatibile con Excel**, riscritto per eliminare il problema delle colonne schiacciate sulle impostazioni europee di Microsoft Excel.

La struttura è pensata per essere **personalizzata sul brand del cliente finale** (identità visiva, categorie, listini e gateway di pagamento) e consegnata chiavi in mano con un pannello di gestione autonomo.

---

## Avvio Rapido in Locale

### 1. Variabili d'Ambiente
Copia i file `.env.example` creando `.env` (nella root) e `server/.env` con le tue credenziali PostgreSQL locali:

```env
# .env (Root)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:LA_TUA_PASSWORD@localhost:5432/kronovolt_commerce?schema=public"
NEXTAUTH_SECRET="INSERISCI_UNA_CHIAVE_SEGRETA_CASUALE"
NEXTAUTH_URL=http://localhost:3000

```

```env
# server/.env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:LA_TUA_PASSWORD@localhost:5432/kronovolt_commerce?schema=public"
```

### 2. Installazione e Sincronizzazione Database
```bash
# Installa le dipendenze Frontend e Backend
npm install
cd server && npm install

# Sincronizza lo schema Prisma su PostgreSQL
npx prisma db push
```

### 3. Avvio dei Servizi
Apri due terminali:

```bash
# Terminale 1 — API Server (http://localhost:3001)
cd server
npm start
```

```bash
# Terminale 2 — Next.js Storefront & Admin Console (http://localhost:3000)
npm run dev
```

### 4. Accesso Demo (1-Click integrato in `/login`)
Nella pagina `http://localhost:3000/login` sono disponibili i pulsanti di accesso rapido:
- **Console Admin:** `admin@kronovolt.com` / `Admin1234!`
- **Cliente Demo:** `demo@kronovolt.com` / `Demo1234!`

© 2026 Filippo De Biase — Tutti i diritti riservati. Codice pubblicato esclusivamente a scopo dimostrativo e di portfolio.