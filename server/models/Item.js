const { Schema, model } = require('mongoose');
const CATEGORIES = ['electronics', 'id cards', 'wallets', 'keys', 'books', 'bags', 'other'];
module.exports = model('Item', new Schema({
  title: { type: String, required: [true, 'Item name is required'], trim: true, maxlength: 80 },
  type: { type: String, enum: { values: ['LOST', 'FOUND'], message: 'Type must be LOST or FOUND' }, required: true },
  category: { type: String, enum: { values: CATEGORIES, message: 'Choose a valid category' }, required: true },
  description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 500 },
  additionalDetails: { type: String, trim: true, maxlength: 1000 },
  location: { type: String, required: [true, 'Location is required'], trim: true },
  date: { type: Date, required: [true, 'Date is required'] },
  imageUrl: String,
  status: { type: String, enum: ['OPEN', 'CLAIM_PENDING', 'RETURNED'], default: 'OPEN' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
}));
