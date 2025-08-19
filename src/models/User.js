const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  instagram: { type: Boolean, default: false },
  tiktok:    { type: Boolean, default: false },
  youtube:   { type: Boolean, default: false },
  whatsapp:  { type: Boolean, default: false },
  telegram:  { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, default: null }, // referralCode لشخص أحالك
  interactionCode: { type: String, default: '' }, // رمز التفاعل
  balanceYer: { type: Number, default: 0 },
  baseRewardClaimed: { type: Boolean, default: false },
  tasks: { type: taskSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

