const { Schema, model } = require('mongoose');
module.exports = model('Claim', new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  claimantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: [true, 'Please explain why the item is yours'], trim: true, minlength: [10, 'Please write at least 10 characters'] },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
}));
