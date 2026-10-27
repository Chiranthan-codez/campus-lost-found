const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express'), mongoose = require('mongoose'), cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/claims', require('./routes/claims'));
app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join('. ') });
  if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' });
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Server error' });
});
const { connectDB } = require('./db');
connectDB()
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('API running on port ' + (process.env.PORT || 5000))))
  .catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
