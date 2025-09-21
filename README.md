# Backend

API REST realizzata con Node.js, Express e MongoDB/Mongoose.
Gestisce autenticazione utenti, creazione e gestione campi sportivi e sistema di prenotazioni.

🚀 Tecnologie usate

Node.js come runtime, Express come framework, MongoDB come database, Mongoose come ODM.
Per la sicurezza e l’autenticazione vengono usati JWT per i token e bcrypt per l’hashing delle password.

📂 Struttura progetto

La cartella Controller contiene la logica delle rotte (auth, campi, prenotazioni).
La cartella Middlware contiene i middleware, ad esempio per la verifica del token.
La cartella Model contiene gli schemi Mongoose (User, Campo, Prenotazione, RefreshToken).
La cartella Route definisce le rotte Express.
Il file App.js è l’entrypoint principale del server.

⚙️ Installazione

Clona la repository del backend, entra nella cartella e installa le dipendenze con npm install.

🔑 Variabili d’ambiente

Il progetto richiede un file .env con le variabili necessarie.
Come riferimento è disponibile .env.example.
Tra le variabili principali ci sono:

PORT, la porta del server (ad esempio 3000)

DB_STRING, la stringa di connessione a MongoDB

TOKEN_ACCESSO, il segreto per generare i token di accesso JWT

TOKEN_REFRESH, il segreto per generare i token di refresh JWT

▶️ Avvio del server

Avvia il server con npm start.
Per default sarà disponibile su http://localhost:3000 o sulla porta specificata nel file .env.

📌 Rotte principali
Autenticazione

Registrazione utente: POST su /api/auth/registrazione

Login utente: POST su /api/auth/login

Logout utente: POST su /api/auth/logout

Refresh token: POST su /api/auth/refreshtoken

Campi

Lista campi di un comune: GET su /api/campo/:comune

Creazione campo: POST su /api/campo (solo proprietario autenticato)

Eliminazione campo: DELETE su /api/campo/:campoid (solo proprietario del campo)

Aggiornamento campo: PUT su /api/campo/:campoid (solo proprietario del campo)

Like o unlike: PUT su /api/campo/:campoid/like

Prenotazioni

Creazione prenotazione: POST su /api/prenotazioni con campoid, inizio, fine e note opzionali

Lista prenotazioni dell’utente autenticato: GET su /api/prenotazioni/mie

Cancellazione prenotazione: DELETE su /api/prenotazioni/:prenid (consentita all’utente che l’ha creata o al proprietario del campo)

🧪 Note sviluppo

Le password vengono salvate in forma hashata con bcrypt.
Il sistema utilizza due token JWT: accesso e refresh.
Il backend gestisce il controllo di sovrapposizione delle prenotazioni e impedisce di occupare slot già presi.
Una prenotazione cancellata non blocca più la fascia oraria, che torna prenotabile.

Realizzato Maggio 2025
