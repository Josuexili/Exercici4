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

// MODEL: Album
const albumSchema = new mongoose.Schema({
  artist: String,
  title: String,
  date: Date,
});

const Album = mongoose.model('Album', albumSchema);

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('API Albums OK');
});

/**
 * POST /add
 * Afegeix un àlbum
 */
app.post('/add', async (req, res) => {
  try {
    const album = new Album({
      artist: req.body.artist,
      title: req.body.title,
      date: new Date(req.body.date),
    });

    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /list
 * Retorna tots els àlbums
 */
app.get('/list', async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /list/:dataini/:datafi
 * Retorna àlbums entre dues dates
 */
app.get('/list/:dataini/:datafi', async (req, res) => {
  const { dataini, datafi } = req.params;

  try {
    const albums = await Album.find({
      date: {
        $gte: new Date(dataini),
        $lte: new Date(datafi),
      },
    });

    res.status(200).json(albums);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
