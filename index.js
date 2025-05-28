require('dotenv').config(); // Carga las variables desde .env

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB desde .env
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Esquema de datos
const registroSchema = new mongoose.Schema({
  fechaHora: { type: String, required: true },
  dato: { type: String, required: true }
});
const Registro = mongoose.model('Registro', registroSchema);

// POST: Guardar dato
app.post('/api/datos', async (req, res) => {
  const { fechaHora, dato } = req.body;
  if (!fechaHora || !dato) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const nuevoRegistro = new Registro({ fechaHora, dato });
    await nuevoRegistro.save();
    console.log('📥 Guardado:', fechaHora, dato);
    res.json({ mensaje: 'Dato guardado en MongoDB' });
  } catch (error) {
    console.error('❌ Error al guardar:', error);
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});

// GET: Obtener datos
app.get('/api/datos', async (req, res) => {
  try {
    const registros = await Registro.find().sort({ _id: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
