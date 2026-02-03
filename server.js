const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3031;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexió a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

/**
 * MODEL: Tasca
 * Exemple document:
 * {
 *   nom: "Marc",
 *   cognom1: "López",
 *   cognom2: "Soler",
 *   dataEntrada: Date,
 *   completa: false,
 *   observacions: "Falta adjuntar document"
 * }
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
    collection: 'entrades', // Important: assegura el nom real de la col·lecció
    timestamps: false, // No afegeix createdAt/updatedAt (si no ho vols)
  }
);

const Tasca = mongoose.model('Tasca', tascaSchema);

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('API Tasques OK');
});

/**
 * POST /add
 * Afegeix una tasca
 */
app.post('/add', async (req, res) => {
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
 * GET /list
 * Retorna totes les tasques
 */
app.get('/list', async (req, res) => {
  try {
    const tasques = await Tasca.find().sort({ dataEntrada: -1 });
    res.status(200).json(tasques);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /list/:dataini/:datafi
 * Retorna tasques entre dues dates (dataEntrada)
 * Exemple: /list/2025-11-01/2025-11-30
 */
app.get('/list/:dataini/:datafi', async (req, res) => {
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

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
