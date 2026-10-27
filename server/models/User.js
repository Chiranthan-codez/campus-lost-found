const { Schema, model } = require('mongoose');
module.exports = model('User', new Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'] },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}));
