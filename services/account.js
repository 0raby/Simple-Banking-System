const Account = require('../models/account');
const APIFeatures = require('../utils/APIFeatures');
const accountRepo = require('../Repositories/account');
const AppError = require('./../utils/AppError');

exports.getAllAccounts = async (query) => {
  const features = new APIFeatures(accountRepo.findAll(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const accounts = await features.query;
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
  const randomNumberForCreditCard = Math.floor(1e15 + Math.random() * 9e15);
  const newCreditCardNo = randomNumberForCreditCard.toString();
  const randomThreeDigit = Math.floor(100 + Math.random() * 900);
  const newCvv = randomThreeDigit.toString();
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const nextYear = String((now.getFullYear() + 1) % 100).padStart(2, '0');
  const newExpDate = `${month}/${nextYear}`;

  const newAccount = await accountRepo.createAccount({
    name: name1,
    nationalID,
    creditCardNo: newCreditCardNo,
    cvv: newCvv,
    expDate: newExpDate,
  });

  const { name, creditCardNo, cvv, expDate, balance } = newAccount;
  return { name, creditCardNo, cvv, expDate, balance };
};

exports.updateAccount = async (uuid, updatedname) => {
  const updatedAccount = await accountRepo.updateAccount(uuid, updatedname);

  if (!updatedAccount) {
    return next(new AppError('no account found to update', 404));
  }
  const { id, name, balance, maskedCreditCardNo } = updatedAccount;
  return { id, name, balance, maskedCreditCardNo };
};

exports.deleteAccount = async (uuid) => {
  await accountRepo.deleteAccount(uuid);
};
