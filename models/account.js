const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4(),
      unique: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: [20, 'Name cannot exceed 20 characters'],
      minlength: [3, 'Name cannot be less than 3 characters'],
    },
    creditCardNo: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (val) {
      //     return /^\d{16}$/.test(val); //checks for 16 digits
      //   },
      //   message: 'Invalid credit card number!',
      // },
      //   select: false,
      unique: true,
    },
    expDate: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (val) {
      //     return /^(0[1-9]|1[0-2])\/\d{2}$/.test(val); // MM/YY format
      //   },
      //   message: 'Expiry date need to be in MM/YY format!',
      // },
      // select: false,
    },
    cvv: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (val) {
      //     return /^\d{3,4}$/.test(val); //3 or 4 digits
      //   },
      //   message: 'CVV need to be 3 or 4 digits',
      // },
      // select: false,
    },
    balance: {
      type: Number,
      default: 1500,
    },
    nationalID: {
      type: String,
      required: [true, 'Please enter your nationalID'],
      validate: {
        validator: function (val) {
          return /^\d{4}$/.test(val);
        },
        message: 'National ID need to be 4 digits(for testing)',
      },
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accountSchema.virtual('maskedCreditCardNo').get(function () {
  return `****-****-****-${this.creditCardNo.substring(12)}`;
});

accountSchema.pre('save', function (next) {
  if (this.balance < 0) {
    return next(new Error('Balance cannot be negative'));
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
