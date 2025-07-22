const Account = require('../models/account');
const APIFeatures = require('../utils/APIFeatures');
const accountRepo = require('../Repositories/account');
const AppError = require('./../utils/AppError');
const createNewCard = require('./../utils/createNewCreditCard');

exports.getAllAccounts = async (query) => {
  const features = new APIFeatures(accountRepo.findAll(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const accounts = await features.query.select('-expDate -cvv');
  return accounts;
};

exports.getAccountById = async (uuid) => {
  const account = await accountRepo.findById(uuid);
  if (!account) {
    throw new AppError('Account not Found', 404);
  }
  const { id, name, balance } = account;
  const maskedCreditCardNo = account.maskedCreditCardNo;

  return {
    id,
    name,
    balance,
    creditCardNumber: maskedCreditCardNo,
  };
};

exports.createAccount = async (name1, nationalID) => {
  const newCard = createNewCard();

  const newAccount = await accountRepo.createAccount({
    name: name1,
    nationalID,
    creditCardNo: newCard.CreditCardNo,
    cvv: newCard.Cvv,
    expDate: newCard.ExpDate,
  });

  const { id, name, creditCardNo, cvv, expDate, balance } = newAccount;
  return { id, name, creditCardNo, cvv, expDate, balance };
};

exports.updateAccount = async (uuid, updatedname) => {
  const updatedAccount = await accountRepo.updateAccount(uuid, updatedname);

  if (!updatedAccount) {
    throw new AppError('no account found to update', 404);
  }
  const { id, name, balance, maskedCreditCardNo } = updatedAccount;
  return { id, name, balance, maskedCreditCardNo };
};

exports.deleteAccount = async (uuid) => {
  await accountRepo.deleteAccount(uuid);
};
