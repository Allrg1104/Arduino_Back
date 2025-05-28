// backend-datos/api/datos.js
import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

let conn = null;

async function connectDB() {
  if (conn) return conn;

  conn = await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return conn;
}

const registroSchema = new mongoose.Schema({
  fechaHora: { type: String, required: true },
  dato: { type: String, required: true }
});

const Registro = mongoose.models.Registro || mongoose.model('Registro', registroSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { fechaHora, dato } = req.body;
    if (!fechaHora || !dato) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
      const nuevoRegistro = new Registro({ fechaHora, dato });
      await nuevoRegistro.save();
      return res.status(200).json({ mensaje: 'Dato guardado en MongoDB' });
    } catch (error) {
      console.error('Error al guardar:', error);
      return res.status(500).json({ error: 'Error al guardar en la BD' });
    }
  }

  if (req.method === 'GET') {
    try {
      const registros = await Registro.find();
      return res.status(200).json(registros);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
