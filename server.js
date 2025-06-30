require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/corelab';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Modelo com favorito e cor
const ItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  favorito: { type: Boolean, default: false },
  cor: { type: String, default: '#ffffff' }
});
const Item = mongoose.model('Item', ItemSchema);

// Rotas
app.get('/items', async (req, res) => {
  const items = await Item.find().sort({ favorito: -1 });
  res.json(items);
});

app.post('/items', async (req, res) => {
  const { nome, descricao, cor } = req.body;
  const novoItem = new Item({
    nome,
    descricao,
    cor: cor || '#ffffff'
  });
  await novoItem.save();
  res.json(novoItem);
});

app.put('/items/:id', async (req, res) => {
  const { nome, descricao } = req.body;
  const itemAtualizado = await Item.findByIdAndUpdate(
    req.params.id,
    { nome, descricao },
    { new: true }
  );
  res.json(itemAtualizado);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item apagado com sucesso' });
});

// Atualizar favorito
app.put('/items/:id/favorito', async (req, res) => {
  const item = await Item.findById(req.params.id);
  item.favorito = !item.favorito;
  await item.save();
  res.json(item);
});

// Atualizar cor
app.put('/items/:id/cor', async (req, res) => {
  const { cor } = req.body;
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { cor },
    { new: true }
  );
  res.json(item);
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('API Corelab está no ar 🚀');
});

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

