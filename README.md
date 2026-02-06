Gestor de Tasques amb Node.js, Express i MongoDB

Aplicació web senzilla per gestionar tasques d’alumnes amb un CRUD complet:

Crear tasques

Llistar tasques

Editar tasques

Marcar com completades

Eliminar tasques

Filtrar tasques per alumne

El backend està fet amb Node.js + Express + MongoDB, i el frontend amb HTML i JavaScript pur.

Requisits

Cal tenir instal·lat:

Node.js (versió 18 o superior recomanada)

npm

Accés a una base de dades MongoDB

Estructura del projecte
projecte/
│
├─ public/
│   └─ index.html
│
├─ server.js
├─ package.json
└─ .env

Instal·lació
1. Instal·lar dependències

Obre una terminal dins la carpeta del projecte i executa:

npm install

2. Configurar la connexió a MongoDB

Crea un fitxer .env a l’arrel del projecte amb el següent contingut:

MONGO_URI=mongodb://localhost:27017/tasques
PORT=3031


Si utilitzes MongoDB Atlas, posa la teva cadena de connexió:

MONGO_URI=mongodb+srv://usuari:password@cluster.mongodb.net/tasques
PORT=3031

3. Iniciar el servidor

Executa:

node server.js


Si tot funciona correctament, veuràs:

MongoDB connected
Server is running on http://localhost:3031

Accés a l’aplicació

Obre el navegador i entra a:

http://localhost:3031


Apareixerà la interfície del gestor de tasques.

Funcionalitats principals
Crear tasca

Escriu nom, cognom, data i observacions.

Clica Crear Tasca.

Editar tasca

Clica Editar en una tasca.

Modifica els camps.

Clica Guardar canvis.

Cancel·lar edició

Clica Cancel·lar edició per tornar al mode crear.

Completar tasca

Clica Completar per marcar-la com feta.

Clica Desmarcar per tornar-la a pendent.

Eliminar tasca

Clica Eliminar i confirma.

Filtrar per alumne

Selecciona un alumne al desplegable.

Rutes de l’API
CRUD principal
Mètode	Ruta	Descripció
POST	/tasques	Crear tasca
GET	/tasques	Llistar tasques
GET	/tasques/:id	Veure tasca
PATCH	/tasques/:id	Actualitzar tasca
DELETE	/tasques/:id	Eliminar tasca
Rutes extra
Mètode	Ruta	Descripció
GET	/tasques/dates/:dataini/:datafi	Filtrar per dates
GET	/alumnes	Llistar alumnes
GET	/alumnes/:nom/tasques	Tasques d’un alumne
Notes tècniques

Base de dades: MongoDB

Backend: Node.js + Express

ORM: Mongoose

Frontend: HTML + JavaScript

Autor

Projecte realitzat com a exercici acadèmic de CRUD amb Node.js i MongoDB.
