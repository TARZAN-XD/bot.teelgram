const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amountYer: { type: Number, required: true },
  method: { type: String, default: 'manual' }, // مثال: STC, PayPal, ... لاحقًا
  status: { type: String, enum: ['pending','approved','rejected','paid'], default: 'pending' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
