const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4(),
    unique: true,
  },
  fromAccount: {
    type: String, // not ObjectId
    ref: 'Account',
  },
  toAccount: {
    type: String,
    ref: 'Account',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['TRANSFER', 'DEPOSIT', 'WITHDRAWAL'],
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transactions', transactionSchema);

module.exports = Transaction;
