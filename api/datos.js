import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const registroSchema = new (require('mongoose')).Schema({
  fechaHora: { type: String, required: true },
  dato: { type: String, required: true },
});

let Registro;

async function dbConnect() {
  if (Registro) return;
  await connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  Registro = require('mongoose').models.Registro || require('mongoose').model('Registro', registroSchema);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const registros = await Registro.find().sort({ _id: -1 });
      return res.status(200).json(registros);
    } catch (err) {
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }
  }

  if (req.method === 'POST') {
    const { fechaHora, dato } = req.body;
    if (!fechaHora || !dato) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
      const nuevo = new Registro({ fechaHora, dato });
      await nuevo.save();
      return res.status(200).json({ mensaje: 'Dato guardado correctamente' });
    } catch (err) {
      return res.status(500).json({ error: 'Error al guardar el dato' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
