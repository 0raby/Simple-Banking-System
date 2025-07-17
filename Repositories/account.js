const Account = require('../models/account');

exports.findAll = () => {
  return Account.find().select('-_id -__v');
};

exports.findById = (uuid, options = {}) => {
  return Account.findOne({ id: uuid })
    .select('-_id -__v')
    .session(options.session || null);
};

exports.createAccount = (newAccount) => {
  return Account.create(newAccount);
};

exports.updateAccount = (uuid, updatedName) => {
  return Account.findOneAndUpdate(
    { id: uuid },
    { name: updatedName },
    {
      new: true,
      runValidators: true,
    }
  ).select('-_id -__v -expDate -cvv -nationalID');
};

exports.updateAccountBalance = (uuid, updatedBalance, options = {}) => {
  return Account.findOneAndUpdate(
    { id: uuid },
    { balance: updatedBalance },
    {
      new: true,
      runValidators: true,
      ...options,
    }
  ).select('-_id -__v -expDate -cvv -nationalID');
};

exports.deleteAccount = (uuid) => {
  return Account.findOneAndDelete({ id: uuid });
};
