const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3031;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Connexió a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

/**
 * MODEL: Tasca
 */
const tascaSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    cognom1: { type: String, required: true, trim: true },
    cognom2: { type: String, default: null, trim: true },
    dataEntrada: { type: Date, required: true, default: Date.now },
    completa: { type: Boolean, required: true, default: false },
    observacions: { type: String, default: '', trim: true },
  },
  {
    collection: 'entrades',
    timestamps: false,
  }
);

const Tasca = mongoose.model('Tasca', tascaSchema);

/**
 * RUTA BASE
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// ===============================
// CRUD PRINCIPAL (REQUERIT)
// ===============================

/**
 * POST /tasques
 * Crear tasca
 */
app.post('/tasques', async (req, res) => {
  try {
    const tasca = new Tasca({
      nom: req.body.nom,
      cognom1: req.body.cognom1,
      cognom2: req.body.cognom2 ?? null,
      dataEntrada: req.body.dataEntrada
        ? new Date(req.body.dataEntrada)
        : new Date(),
      completa:
        typeof req.body.completa === 'boolean' ? req.body.completa : false,
      observacions: req.body.observacions ?? '',
    });

    await tasca.save();
    res.status(201).json(tasca);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /tasques
 * Llistar totes
 */
app.get('/tasques', async (req, res) => {
  try {
    const tasques = await Tasca.find().sort({ dataEntrada: -1 });
    res.status(200).json(tasques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /tasques/:id
 * Veure una tasca per id
 */
app.get('/tasques/:id', async (req, res) => {
  try {
    const tasca = await Tasca.findById(req.params.id);

    if (!tasca) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    res.status(200).json(tasca);
  } catch (err) {
    res.status(400).json({ message: 'ID no vàlid' });
  }
});

/**
 * PATCH /tasques/:id
 * Actualitzar tasca
 */
app.patch('/tasques/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.dataEntrada) {
      updateData.dataEntrada = new Date(req.body.dataEntrada);
    }

    const tasca = await Tasca.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tasca) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    res.status(200).json(tasca);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /tasques/:id
 * Eliminar tasca
 */
app.delete('/tasques/:id', async (req, res) => {
  try {
    const tasca = await Tasca.findByIdAndDelete(req.params.id);

    if (!tasca) {
      return res.status(404).json({ message: 'Tasca no trobada' });
    }

    res.status(200).json({ message: 'Tasca eliminada correctament' });
  } catch (err) {
    res.status(400).json({ message: 'ID no vàlid' });
  }
});

// ===============================
// FILTRAT PER DATES
// ===============================

/**
 * GET /tasques/dates/:dataini/:datafi
 * Exemple: /tasques/dates/2025-11-01/2025-11-30
 */
app.get('/tasques/dates/:dataini/:datafi', async (req, res) => {
  const { dataini, datafi } = req.params;

  try {
    const tasques = await Tasca.find({
      dataEntrada: {
        $gte: new Date(dataini),
        $lte: new Date(datafi),
      },
    }).sort({ dataEntrada: -1 });

    res.status(200).json(tasques);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===============================
// RUTES EXTRA (NIVELL FINAL)
// ===============================

/**
 * GET /alumnes
 * Llista alumnes sense duplicats
 */
app.get('/alumnes', async (req, res) => {
  try {
    const alumnes = await Tasca.aggregate([
      {
        $group: {
          _id: {
            nom: '$nom',
            cognom1: '$cognom1',
            cognom2: '$cognom2',
          },
        },
      },
      {
        $project: {
          _id: 0,
          nom: '$_id.nom',
          cognom1: '$_id.cognom1',
          cognom2: '$_id.cognom2',
        },
      },
    ]);

    res.json(alumnes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /alumnes/:nom/tasques
 * Tasques d'un alumne
 */
app.get('/alumnes/:nom/tasques', async (req, res) => {
  try {
    const tasques = await Tasca.find({
      nom: req.params.nom,
    }).sort({ dataEntrada: -1 });

    res.json(tasques);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ===============================
// INICI DEL SERVIDOR
// ===============================
module.exports = app;





/*
CRUD principal

POST /tasques

GET /tasques

GET /tasques/:id

PATCH /tasques/:id

DELETE /tasques/:id

Extra

GET /tasques/dates/:dataini/:datafi

GET /alumnes

GET /alumnes/:nom/tasques


He fet el CRUD estàndard, però també he afegit rutes orientades a l’usuari, per poder gestionar les tasques per alumne, que és un flux més natural en una aplicació real.
*/
