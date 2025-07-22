module.exports = () => {
  const randomNumberForCreditCard = Math.floor(1e15 + Math.random() * 9e15);
  const CreditCardNo = randomNumberForCreditCard.toString();
  const randomThreeDigit = Math.floor(100 + Math.random() * 900);
  const Cvv = randomThreeDigit.toString();
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const nextYear = String((now.getFullYear() + 1) % 100).padStart(2, '0');
  const ExpDate = `${month}/${nextYear}`;

  return { CreditCardNo, Cvv, ExpDate };
};
