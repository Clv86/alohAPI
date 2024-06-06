const express = require('express');
const app = express();
const PORT = 8080;
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Cl:CJeUaz0TLUBkp4Hi@cluster0.y5turie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)