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

// Modelo
const ItemSchema = new mongoose.Schema({
  nome: String,
  descricao: String
});
const Item = mongoose.model('Item', ItemSchema);

// Rotas
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const novoItem = new Item({
    nome: req.body.nome,
    descricao: req.body.descricao
  });
  await novoItem.save();
  res.json(novoItem);
});

app.put('/items/:id', async (req, res) => {
  const itemAtualizado = await Item.findByIdAndUpdate(
    req.params.id,
    { nome: req.body.nome, descricao: req.body.descricao },
    { new: true }
  );
  res.json(itemAtualizado);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item apagado com sucesso' });
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

