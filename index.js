const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Reemplaza con tu URI real de MongoDB (local o Atlas)
const mongoURI = 'mongodb+srv://allrg1104:vL4leF1sPmgI5w2Z@cluster0.xtqyw.mongodb.net/BD_arduino?retryWrites=true&w=majority&appName=Cluster0';

// Conexión a MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error de conexión a MongoDB:', err));

// Esquema y modelo para los registros
const registroSchema = new mongoose.Schema({
  fechaHora: { type: String, required: true },
  dato: { type: String, required: true }
});

const Registro = mongoose.model('Registro', registroSchema);

// Endpoint para recibir datos del botón y la fecha/hora
app.post('/api/datos', async (req, res) => {
  const { fechaHora, dato } = req.body;
  if (!fechaHora || !dato) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const nuevoRegistro = new Registro({ fechaHora, dato });
    await nuevoRegistro.save();
    console.log('Dato guardado en MongoDB:', fechaHora, dato);
    res.json({ mensaje: 'Dato guardado en MongoDB' });
  } catch (error) {
    console.error('Error al guardar en MongoDB:', error);
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});

// Endpoint para ver todos los registros
app.get('/api/datos', async (req, res) => {
  try {
    const registros = await Registro.find();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
