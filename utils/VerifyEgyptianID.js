const AppError = require('./AppError');
module.exports = (id) => {
  var ID = id;
  if (ID.length < 14 || ID.length > 14) {
    throw new AppError('Invalid ID number', 400);
  } else {
    var resp = [];
    var gen = parseInt(ID.substr(0, 1)); //gets the generation of the person
    var year = parseInt(ID.substr(1, 2)); //gets the birth year
    var month = parseInt(ID.substr(3, 2)); //gets birth month
    var day = parseInt(ID.substr(5, 2)); //gets birth day
    var code = ID.substr(7, 2); //gets the city code
    var gender = parseInt(ID.substr(12, 1)); //gets the gender
    if (gender % 2 == 0) {
      resp.push('Gender: Female');
    } else {
      resp.push('Gender: Male');
    }
    resp.push('City code:' + code);

    if (year > 6 && gen == 3) {
      throw new AppError('Invalid ID number : Incorrect Birth Year', 400);
    } else {
      resp.push('Birth Year:' + year);
    }
    var dof;
    if (month < 1 || month > 12) {
      throw new AppError('Invalid ID number: Incorrect Birth Month', 400);
    } else {
      resp.push('Birth Month:' + month);
    }

    switch (month) {
      case 2:
        dof = 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        dof = 30;
        break;
      default:
        dof = 31;
        break;
    }
    if (day > dof) {
      throw new AppError('Invalid ID number: Incorrect Birth Day', 400);
    } else {
      resp.push('Birth Day:' + day);
    }

    return resp;
  }
};
